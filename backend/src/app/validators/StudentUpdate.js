import Student from '../models/Student';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    name: Yup.string().min(1),
    email: Yup.string()
      .min(1)
      .email(),
    weight: Yup.number().min(0),
    height: Yup.number().min(0),
    birthday: Yup.date().max(new Date()),
  });

  await schema.validate(req.body, { abortEarly: false }).catch(error => {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  });

  const student = await Student.findByPk(req.params.id);

  if (!student) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  }

  const { email } = req.body;

  if (email && email !== student.email) {
    const studentOld = await Student.findOne({ where: { email } });

    if (studentOld) {
      return res.status(400).json({
        error: 'Validation fails',
        messages: [{ errors: ['Student email not available'] }],
      });
    }
  }

  return next();
};
