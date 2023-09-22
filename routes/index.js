const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
  console.log('лох');
});

module.exports = router;
