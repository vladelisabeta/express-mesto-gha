const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../utils/consts');

const {
  getUsers, getUserById, updateProfile, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');

// получить пользователей
router.get('/users', getUsers);
router.get('/users/me', getCurrentUserInfo);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById,
);

// обновить профайл
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

// обновить аватар(не синий)
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }),
    }),
  }),
  updateAvatar,
);
module.exports = router;
