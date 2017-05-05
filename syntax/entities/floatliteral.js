const LiteralExpression = require('./literalexpression.js');
const Type = require('./type.js');

class FloatLiteral extends LiteralExpression {
  toString() {
    return `${this.val}`;
  }
  analyze() {
    this.type = Type.FLOAT;
  }
  optimize() {
    return this;
  }
}

module.exports = FloatLiteral;
