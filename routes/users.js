const router = require('express').Router();

const {
  getUsers, getUserById, updateProfile, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
// router.post('/users', createUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);
router.get('/users/me', getCurrentUserInfo);
module.exports = router;
