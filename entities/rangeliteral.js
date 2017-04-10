const LiteralExpression = require('./literalexpression.js');
const Type = require('./type.js');

class RangeLiteral extends LiteralExpression {
  toString() {
    super.toString('Range');
  }
  analyze() {
    this.type = Type.INT;
  }
}

module.exports = RangeLiteral;
