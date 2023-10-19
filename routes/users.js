const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateProfile, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');
// получить пользователей
router.get('/users', getUsers);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string(),
    }),
  }),
  getUserById,
);

// ненужный? кусок кода переехал в апп
// router.post('/users', createUser);

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
      avatar: Joi.string(),
    }),
  }),
  updateAvatar,
);
router.get('/users/me', getCurrentUserInfo);
module.exports = router;

// router.get('/users', getUsers);
// router.get('/users/:userId', getUserById);
// // router.post('/users', createUser);
// router.patch('/users/me', updateProfile);
// router.patch('/users/me/avatar', updateAvatar);
// router.get('/users/me', getCurrentUserInfo);
// module.exports = router;
