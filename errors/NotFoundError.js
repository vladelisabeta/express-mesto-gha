const { HTTP_STATUS_NOT_FOUND } = require('../utils/consts');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = HTTP_STATUS_NOT_FOUND; // 404
  }
}

module.exports = NotFoundError;
