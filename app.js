const express = require('express');
const mongoose = require('mongoose');
const {
  HTTP_STATUS_NOT_FOUND,
} = require('http2').constants;
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000, MONGOHOST = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(MONGOHOST, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '650c80bcf5de093a46dcd085',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
// app.use(errorRouter);

app.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
