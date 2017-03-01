const LiteralExpression = require('./literalexpression.js');

class IntegerLiteral extends LiteralExpression {
  toString() {
    return `${this.val}`;
  }
}

module.exports = IntegerLiteral;
