import { Op } from 'sequelize';
import { subDays, startOfDay, endOfDay, parseISO } from 'date-fns';

import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const { page = 1, limit = 0, start_date, end_date } = req.query;

    const startDateSearch = start_date
      ? parseISO(start_date)
      : subDays(new Date(), 90);
    const endDateSearch = end_date ? parseISO(end_date) : new Date();

    const pagination = {};
    if (Number(limit)) {
      pagination.limit = Number(limit);
      pagination.offset = (page - 1) * Number(limit);
    }

    const data = await Checkin.findAndCountAll({
      where: {
        student_id: req.params.student_id,
        created_at: {
          [Op.between]: [startOfDay(startDateSearch), endOfDay(endDateSearch)],
        },
      },
      order: [['createdAt', 'desc']],
      ...pagination,
    });

    return res.json({
      checkins: data.rows,
      page: limit ? page : null,
      last_page: Math.ceil(data.count / limit) || 1,
      total: data.count,
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
