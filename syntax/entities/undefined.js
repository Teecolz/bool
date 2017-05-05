const Type = require('./type.js');

class Undefined {
  constructor() {
    this.name = 'undefined';
    this.type = Type.ARBITRARY;
  }
}

module.exports = Undefined;
