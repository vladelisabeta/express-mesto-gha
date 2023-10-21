const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('../utils/consts');

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;

  res.status(statusCode)
    .send({
      message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'На сервере произошла непредвиденная ошибка!'
        : message,
    });
  next();
};

module.exports = errorHandler;
