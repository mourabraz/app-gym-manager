import Sequelize from 'sequelize';
import { addDays, differenceInDays, parseISO } from 'date-fns';

import Student from '../models/Student';

class DashboardBirthdaysController {
  async index(req, res) {
    const { start_date, end_date } = req.query;

    const startDateSearch = start_date ? parseISO(start_date) : new Date();
    const endDateSearch = end_date
      ? parseISO(end_date)
      : addDays(new Date(), 30);

    const days = differenceInDays(endDateSearch, startDateSearch);

    const students = await Student.findAll({
      where: Sequelize.where(
        Sequelize.literal(
          `EXTRACT(YEARS FROM AGE(birthday)) - EXTRACT(YEARS FROM AGE(birthday - interval '${String(
            days
          )}' day))`
        ),
        -1
      ),
      attributes: [
        'id',
        'name',
        'birthday',
        [Sequelize.literal(`EXTRACT(YEARS FROM AGE(birthday))`), 'age'],
        [
          Sequelize.literal(
            `${days} - EXTRACT(DAYS FROM AGE(birthday - interval '${String(
              days
            )}' day))`
          ),
          'days',
        ],
      ],
    });

    return res.json(students);
  }
}

export default new DashboardBirthdaysController();
