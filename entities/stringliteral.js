const LiteralExpression = require('./literalexpression.js');

class StringLiteral extends LiteralExpression {
  toString() {
    return `"${this.val}"`;
  }
}

module.exports = StringLiteral;
