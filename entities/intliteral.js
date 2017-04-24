const Type = require('./type.js');

class IntegerLiteral {
  constructor(val) {
    this.val = val;
  }
  analyze() {
    this.type = Type.INT;
  }
  toString() {
    return `${this.val}`;
  }
}

module.exports = IntegerLiteral;
