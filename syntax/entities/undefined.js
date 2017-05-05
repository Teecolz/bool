const Type = require('./type.js');

class Undefined {
  constructor() {
    this.name = 'undefined';
    this.type = Type.ARBITRARY;
  }
  optimize() {
    return this;
  }
}

module.exports = Undefined;
