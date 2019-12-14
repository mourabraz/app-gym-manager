import HelpOrder from '../models/HelpOrder';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    answer: Yup.string().required(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }

  const helpOrder = await HelpOrder.findByPk(req.params.help_order_id);

  if (!helpOrder) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Help Order not found'] }],
    });
  }

  if (helpOrder.answer_at) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Help Order already answered'] }],
    });
  }

  return next();
};
