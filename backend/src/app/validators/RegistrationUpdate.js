import { Op } from 'sequelize';
import { addMonths, parseISO, isEqual } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    student_id: Yup.number(),
    plan_id: Yup.number(),
    start_date: Yup.date().min(new Date()),
  });

  await schema.validate(req.body, { abortEarly: false }).catch(error => {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  });

  const registration = await Registration.findByPk(req.params.id, {
    include: [
      {
        model: Student,
        as: 'student',
      },
      {
        model: Plan,
        as: 'plan',
      },
    ],
  });

  if (!registration) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Registration not found'] }],
    });
  }

  const { student_id, plan_id, start_date } = req.body;

  let { student } = registration;
  if (student_id && student_id !== registration.student_id) {
    student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({
        error: 'Validation fails',
        messages: [{ errors: ['Student not found'] }],
      });
    }
  }

  let { plan } = registration;
  if (plan_id && plan_id !== registration.plan_id) {
    plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(404).json({
        error: 'Validation fails',
        messages: [{ errors: ['Plan not found'] }],
      });
    }
  }

  let startDateParsed = registration.start_date;
  if (start_date && !isEqual(parseISO(start_date), registration.start_date)) {
    startDateParsed = parseISO(start_date);
  }

  let endDate = registration.end_date;
  if (
    (start_date && !isEqual(parseISO(start_date), registration.start_date)) ||
    (plan_id && plan_id !== registration.plan_id)
  ) {
    endDate = addMonths(startDateParsed, plan.duration);
  }

  /*
   * Check if student have a registration between start_date and end_date
   */
  const registrationOld = await Registration.findOne({
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
      id: {
        [Op.ne]: registration.id,
      },
    },
  });

  if (registrationOld) {
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
