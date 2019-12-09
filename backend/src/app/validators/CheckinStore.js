import { Op } from 'sequelize';
import { subDays } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Registration from '../models/Registration';

export default async (req, res, next) => {
  const student = await Student.findByPk(req.params.student_id);

  if (!student) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  }

  const today = new Date();

  /*
   * Check if student have a registration for today
   */
  const registration = await Registration.findOne({
    where: {
      student_id: student.id,
      [Op.and]: [
        {
          start_date: {
            [Op.lte]: today,
          },
        },
        {
          end_date: {
            [Op.gte]: today,
          },
        },
      ],
    },
  });

  if (!registration) {
    return res.status(400).json({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Student does not have a registration for today'],
        },
      ],
    });
  }

  /*
   * Check if student make 5 checkins in the last 7 days
   */
  const checkinsTotal = await Checkin.count({
    where: {
      student_id: student.id,
      created_at: {
        [Op.gte]: subDays(today, 7),
      },
    },
  });

  if (checkinsTotal > 4) {
    return res.status(400).json({
      error: 'Validation fails',
      messages: [
        {
          errors: ['Student already make 5 checkins in the last 7 days'],
        },
      ],
    });
  }

  return next();
};
