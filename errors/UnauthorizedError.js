const { HTTP_STATUS_UNAUTHORIZED } = require('../utils/consts');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = HTTP_STATUS_UNAUTHORIZED; // 401
  }
}

module.exports = UnauthorizedError;
