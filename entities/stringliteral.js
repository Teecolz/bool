const Type = require('./type.js');

class StringLiteral {
  constructor(val) {
    this.val = val;
  }
  analyze() {
    this.type = Type.STRING;
  }
  optimize() {
    return this;
  }
  toString() {
    return `${this.val}`;
  }
}

module.exports = StringLiteral;
