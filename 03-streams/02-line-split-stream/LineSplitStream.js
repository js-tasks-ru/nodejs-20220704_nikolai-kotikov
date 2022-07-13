const stream = require('stream');
const os = require('os');
const {StringDecoder} = require('node:string_decoder');

const decoder = new StringDecoder('utf-8');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._last = '';
  }

  _transform(chunk, encoding, callback) {
    this._last += decoder.write(chunk);
    const list = this._last.split(os.EOL);
    this._last = list.pop();
    for (const item of list) {
      this.push(item);
    }
    callback();
  }

  _flush(callback) {
    this._last += decoder.end();
    if (this._last) {
      this.push(this._last);
    }
    callback();
  }
}

module.exports = LineSplitStream;
