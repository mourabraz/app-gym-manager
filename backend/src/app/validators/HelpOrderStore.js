import Student from '../models/Student';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    question: Yup.string().required(),
  });

  await schema.validate(req.body, { abortEarly: false }).catch(error => {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  });

  const student = await Student.findByPk(req.params.student_id);

  if (!student) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  }

  return next();
};
