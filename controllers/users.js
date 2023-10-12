const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_OK,
  // HTTP_STATUS_NOT_FOUND,
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
// INVALID DATA ЭТО ИМЯ ОШИБКИ (InvalidData)

// GET USERS
module.exports.getUsers = (req, res) => User.find({})
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' }));

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
      if (e.name === DB_DUPLCATE_ERROR_CODE) {
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

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({ email }).select('+password'); // СДЕЛАТЬ ОБРАБОТЧИКИ ОШИБОК
    const matched = await bcrypt.compare(password, userData.password);
    if (!matched) {
      throw new Error('InvalidData');
    }

    const token = jwt.sign({ _id: userData });

    res.cookie(JWT_SECRET, token, { expiresIn: '7d', httpOnly: true, sameSite: true });

    return res.status(HTTP_STATUS_OK).send({ _id: userData });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }

    if (e.message === 'InvalidData') {
      return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
    }

    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(e);
  }
};
