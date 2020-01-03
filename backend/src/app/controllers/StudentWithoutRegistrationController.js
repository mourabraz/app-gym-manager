import Sequelize, { Op } from 'sequelize';

import Student from '../models/Student';

class StudentWithoutRegistrationController {
  async index(req, res) {
    const results = await Student.findAndCountAll({
      attributes: ['id', 'name', 'email'],
      where: {
        id: {
          [Op.in]: Sequelize.literal(
            `(SELECT student_id FROM registrations WHERE registrations.end_date < NOW())`
          ),
        },
      },
    });

    return res.json(results);
  }
}

export default new StudentWithoutRegistrationController();
