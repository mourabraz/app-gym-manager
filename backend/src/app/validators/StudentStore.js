import { subYears } from 'date-fns';
import Student from '../models/Student';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
    weight: Yup.number()
      .min(0)
      .required(),
    height: Yup.number()
      .min(0)
      .required(),
    birthday: Yup.date()
      .max(subYears(new Date(), 10))
      .required(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }

  const studentCount = await Student.count({
    where: { email: req.body.email },
  });

  if (studentCount) {
    return res.status(400).json({
      error: 'Validation fails',
      messages: [{ errors: ['Student email not available'] }],
    });
  }

  return next();
};
