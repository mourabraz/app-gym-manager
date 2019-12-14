import User from '../models/User';

const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string().required(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({
      error: 'Validation fails',
      messages: [{ errors: ['User not found'] }],
    });
  }

  if (!(await user.checkPassword(password))) {
    return res.status(400).json({
      error: 'Validation fails',
      messages: [{ errors: ['Email or Password does not match'] }],
    });
  }

  return next();
};
