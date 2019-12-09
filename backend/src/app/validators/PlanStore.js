import Plan from '../models/Plan';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    duration: Yup.number()
      .min(0)
      .required(),
    price: Yup.number()
      .min(0)
      .required(),
  });

  await schema.validate(req.body, { abortEarly: false }).catch(error => {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  });

  const planCount = await Plan.count({ where: { title: req.body.title } });

  if (planCount) {
    return res.status(400).json({
      error: 'Validation fails',
      messages: [{ errors: ['Plan title not available'] }],
    });
  }

  return next();
};
