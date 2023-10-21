const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const JWT_SECRET = 'very very very very secrety secret';

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    console.log(`в блоке catch auth err.name=${e.name}`);
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  console.log(`${token} auth token`);
  next();
};
