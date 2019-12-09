import Plan from '../models/Plan';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    title: Yup.string().min(1),
    duration: Yup.number().min(0),
    price: Yup.number().min(0),
  });

  await schema.validate(req.body, { abortEarly: false }).catch(error => {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  });

  const plan = await Plan.findByPk(req.params.id);

  if (!plan) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Plan not found'] }],
    });
  }

  const { title } = req.body;

  if (title && title !== plan.title) {
    const planOld = await Plan.findOne({ where: { title } });

    if (planOld) {
      return res.status(400).json({
        error: 'Validation fails',
        messages: [{ errors: ['Plan title not available'] }],
      });
    }
  }

  return next();
};
