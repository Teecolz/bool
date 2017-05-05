const Type = require('./type.js');

class IntegerLiteral {
  constructor(val) {
    this.val = val;
  }
  analyze() {
    this.type = Type.INT;
  }
  optimize() {
    return this;
  }
  toString() {
    return `${this.val}`;
  }
}

module.exports = IntegerLiteral;
