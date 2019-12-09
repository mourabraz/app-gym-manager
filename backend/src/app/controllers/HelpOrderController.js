import { Op } from 'sequelize';

import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const { answered = 0, page = 1 } = req.query;

    const whereQuery = {};

    if (!Number(answered)) {
      whereQuery.answer_at = null;
    } else {
      whereQuery.answer_at = { [Op.ne]: null };
    }

    const helpOrders = await HelpOrder.findAll({
      where: whereQuery,
      order: [['updatedAt', 'desc']],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json({
      help_orders: helpOrders,
      page,
      last_page: Math.ceil(helpOrders.length / 10) || 1,
      total: helpOrders.length,
    });
  }

  async store(req, res) {
    const { question } = req.body;

    const newRecord = await HelpOrder.create({
      question,
      student_id: req.params.student_id,
    });

    return res.json(newRecord);
  }
}

export default new HelpOrderController();
