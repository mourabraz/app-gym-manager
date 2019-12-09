import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Queue from '../../lib/Queue';

import AnswerHelpOrderMail from '../jobs/AnswerHelpOrderMail';

class AnswerHelpOrderController {
  async store(req, res) {
    const helpOrder = await HelpOrder.findByPk(req.params.help_order_id);

    const { answer } = req.body;

    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    const updatedHelpOrder = await HelpOrder.findByPk(helpOrder.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(AnswerHelpOrderMail.key, {
      helpOrder: updatedHelpOrder,
    });

    return res.json(updatedHelpOrder);
  }
}

export default new AnswerHelpOrderController();
