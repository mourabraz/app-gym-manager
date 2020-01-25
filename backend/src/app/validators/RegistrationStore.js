import { Op } from 'sequelize';
import { addMonths, parseISO, startOfDay } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    student_id: Yup.number().required(),
    plan_id: Yup.number().required(),
    start_date: Yup.date()
      .min(startOfDay(new Date()))
      .required(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }

  const { student_id, plan_id, start_date } = req.body;

  const student = await Student.findByPk(student_id);

  if (!student) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  }

  const plan = await Plan.findByPk(plan_id);

  if (!plan) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Plan not found'] }],
    });
  }

  const startDateParsed = parseISO(start_date);

  const endDate = addMonths(startDateParsed, plan.duration);

  /*
   * Check if student have a registration between start_date and end_date
   */
  const registration = await Registration.findOne({
    where: {
      student_id: student.id,
      [Op.and]: [
        {
          start_date: {
            [Op.lt]: endDate,
          },
        },
        {
          end_date: {
            [Op.gt]: startDateParsed,
          },
        },
      ],
    },
  });

  if (registration) {
    return res.status(400).json({
      error: 'Validation fails',
      messages: [
        {
          errors: [
            'Student already have a registration between start and end date',
          ],
        },
      ],
    });
  }

  return next();
};
