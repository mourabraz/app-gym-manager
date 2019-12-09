import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class StudentHelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({
        error: 'Validation fails',
        messages: [{ errors: ['Student not found'] }],
      });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: student.id },
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
}

export default new StudentHelpOrderController();
