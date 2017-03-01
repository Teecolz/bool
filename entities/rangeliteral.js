const LiteralExpression = require('./literalexpression.js');

class RangeLiteral extends LiteralExpression {
  toString() {
    super.toString('Range');
  }
}

module.exports = RangeLiteral;
