const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const User = require('../models/user');

// GET USERS
module.exports.getUsers = (req, res) => User.find({})
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' }));

//  CREATE USER
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((r) => res.status(HTTP_STATUS_CREATED).send(r))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' });
    });
};

// GET USER BY ID
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((r) => {
      if (r === null) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден!' });
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((r) => {
      if (r === null) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден!' });
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError' || e.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: ' Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((r) => {
      if (r === null) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь c указанным _id не найден.' });
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError' || e.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' });
    });
};
