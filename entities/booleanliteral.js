const LiteralExpression = require('./literalexpression.js');

class BooleanLiteral extends LiteralExpression {
  toString() {
    return `${this.val}`;
  }
}

module.exports = BooleanLiteral;
