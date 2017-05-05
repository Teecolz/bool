const Type = require('./type.js');

class StringLiteral {
  constructor(val) {
    this.enclosing = val.charAt(0);
    this.val = val.slice(1, val.length - 1);
  }
  analyze() {
    this.type = Type.STRING;
  }
  optimize() {
    return this;
  }
  toString() {
    return `${this.enclosing}${this.val}${this.enclosing}`;
  }
}

module.exports = StringLiteral;
