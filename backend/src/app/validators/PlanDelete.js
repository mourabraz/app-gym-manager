import Plan from '../models/Plan';

export default async (req, res, next) => {
  const plan = await Plan.findByPk(req.params.id);

  if (!plan) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Plan not found'] }],
    });
  }

  return next();
};
