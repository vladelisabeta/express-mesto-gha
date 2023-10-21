const { HTTP_STATUS_FORBIDDEN } = require('../utils/consts');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    // this.name = 'ForbiddenError';
    this.statusCode = HTTP_STATUS_FORBIDDEN; // 403
  }
}

module.exports = ForbiddenError;
