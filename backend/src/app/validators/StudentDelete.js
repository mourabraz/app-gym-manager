import Student from '../models/Student';

export default async (req, res, next) => {
  const student = await Student.findByPk(req.params.id);

  if (!student) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Student not found'] }],
    });
  }

  return next();
};
