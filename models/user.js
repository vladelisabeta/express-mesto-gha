const isEmail = require('validator/lib/isEmail');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        return /^https?:\/\/(www\.)?[\w-._~:/?#[\]@!$&'()*+,;=]*#?/.test(link);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  console.log('начало функции из схемы юзера');
  return this.findOne({ email }).select('+password')
    .then((user) => {
      console.log('FIND USER BY CREDIAAAA');
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          console.log(matched);
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          console.log('useruseruseruseruser в схеме');
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
