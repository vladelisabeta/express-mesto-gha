const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  // HTTP_STATUS_CONFLICT,
} = require('http2').constants;
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');

const SALT_TIMES = 10;
const DB_DUPLCATE_ERROR_CODE = 11000;
const JWT_SECRET = 'very very very very secrety secret';

// GET USERS ПОФИКСИТЬ
module.exports.getUsers = (req, res, next) => User.find({})
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(next);

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_TIMES)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((r) => res.status(HTTP_STATUS_CREATED).send({
      name: r.name, about: r.about, avatar: r.avatar, email: r.email, _id: r._id,
    }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      if (e.code === DB_DUPLCATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с такими данными уже существует'));
        return;
      }
      next(e);
    });
};

// GET USER BY ID
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((r) => {
      if (r === null) {
        throw new NotFoundError('Пользователь не найден!');
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному _id не найден.'));
        return;
      }
      next(e);
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((r) => {
      res.status(HTTP_STATUS_OK).send(r);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((r) => {
      if (r === null) {
        throw new NotFoundError('Пользователь не найден!');
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError' || e.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      next(e);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((r) => {
      if (r === null) {
        throw new NotFoundError('Пользователь c указанным _id не найден.');
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError' || e.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
        return;
      }
      next(e);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    // .catch(next);
    .catch((e) => {
      next(e);
    });
};
