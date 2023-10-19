const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const {
  HTTP_STATUS_NOT_FOUND,
} = require('http2').constants;
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000, MONGOHOST = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(MONGOHOST, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '650c80bcf5de093a46dcd085',
//   };

//   next();
// });

// app.post('/signin', login);
// app.post('/signup', createUser);

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
      avatar: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser,
);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

// ошибка такой страницы не существует
app.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такой страницы не существует' });
});

// централизированные ошибки

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
