const LiteralExpression = require('./literalexpression.js');
const Type = require('./type.js');

class RangeLiteral extends LiteralExpression {
  toString() {
    super.toString('Range');
  }
  analyze(context) {
    this.val.analyze(context);
    this.type = Type.Construct('[int]');
    this.elementType = Type.INT;
  }
}

module.exports = RangeLiteral;
