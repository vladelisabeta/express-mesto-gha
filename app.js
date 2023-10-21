const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const errorHandler = require('./middlewares/error-handler');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { urlRegex } = require('./utils/consts');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000, MONGOHOST = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(MONGOHOST, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

// логин login
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);

// создание пользователя create user
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser,
);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use(errors());

// ошибка такой страницы не существует
app.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

// централизированные ошибки

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
