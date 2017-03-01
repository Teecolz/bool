const LiteralExpression = require('./literalexpression.js');

class ObjectLiteral extends LiteralExpression {
  toString() {
    super.toString('ObjLiteral');
  }
}

module.exports = ObjectLiteral;
