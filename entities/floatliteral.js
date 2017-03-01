const LiteralExpression = require('./literalexpression.js');

class FloatLiteral extends LiteralExpression {
  toString() {
    return `${this.val}`;
  }
}

module.exports = FloatLiteral;
