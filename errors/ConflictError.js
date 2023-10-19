const { HTTP_STATUS_CONFLICT } = require('../utils/consts');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = HTTP_STATUS_CONFLICT; // 409
  }
}

module.exports = ConflictError;
