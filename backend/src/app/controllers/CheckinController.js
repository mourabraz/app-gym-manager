import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const checkins = await Checkin.findAll({
      where: { student_id: req.params.student_id },
      order: [['createdAt', 'desc']],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json({
      checkins,
      page,
      last_page: Math.ceil(checkins.length / 10) || 1,
      total: checkins.length,
    });
  }

  async store(req, res) {
    const newRecord = await Checkin.create({
      student_id: req.params.student_id,
    });

    return res.json(newRecord);
  }
}

export default new CheckinController();
