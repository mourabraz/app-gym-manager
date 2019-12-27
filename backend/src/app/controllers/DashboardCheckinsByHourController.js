import Sequelize, { Op } from 'sequelize';
import { subDays, startOfDay, endOfDay, parseISO } from 'date-fns';

import Checkin from '../models/Checkin';

class DashboardCheckinsByHourController {
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
        [Sequelize.literal(`EXTRACT(HOUR FROM "created_at")`), 'hour'],
        [Sequelize.literal(`COUNT("id")`), 'count'],
      ],
      group: ['hour'],
      order: [Sequelize.literal(`"hour" ASC`)],
    });

    return res.json(checkins);
  }
}

export default new DashboardCheckinsByHourController();
