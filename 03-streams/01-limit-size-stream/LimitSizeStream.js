const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit || 0;
    this.fileSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.fileSize += chunk.byteLength;
    if (this.fileSize > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
