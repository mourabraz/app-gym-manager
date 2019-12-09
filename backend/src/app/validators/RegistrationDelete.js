import Registration from '../models/Registration';

export default async (req, res, next) => {
  const registration = await Registration.findByPk(req.params.id);

  if (!registration) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Registration not found'] }],
    });
  }

  return next();
};
