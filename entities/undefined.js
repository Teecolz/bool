const Type = require('./type.js');

class Undefined {
  constructor() {
    this.type = Type.ARBITRARY;
  }
}

module.exports = Undefined;
