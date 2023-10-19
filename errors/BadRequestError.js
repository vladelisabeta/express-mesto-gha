const { HTTP_STATUS_BAD_REQUEST } = require('../utils/consts');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = HTTP_STATUS_BAD_REQUEST; // 400
  }
}

module.exports = BadRequestError;
