import Sequelize, { Op } from 'sequelize';
import { subDays, startOfDay, endOfDay, parseISO } from 'date-fns';

import Checkin from '../models/Checkin';

class DashboardCheckinsController {
  async index(req, res) {
    const { start_date, end_date } = req.query;

    const startDateSearch = start_date
      ? parseISO(start_date)
      : subDays(new Date(), 90);
    const endDateSearch = end_date ? parseISO(end_date) : new Date();

    const checkins = await Checkin.findAll({
      where: {
        created_at: {
          [Op.between]: [startOfDay(startDateSearch), endOfDay(endDateSearch)],
        },
      },
      attributes: [
        [Sequelize.literal(`DATE("created_at")`), 'date'],
        [Sequelize.literal(`COUNT("id")`), 'count'],
      ],
      group: ['date'],
      order: [Sequelize.literal(`"date" DESC`)],
    });

    return res.json(checkins);
  }
}

export default new DashboardCheckinsController();
