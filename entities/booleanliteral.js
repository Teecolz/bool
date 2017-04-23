const LiteralExpression = require('./literalexpression.js');
const Type = require('../entities/type.js');

class BooleanLiteral extends LiteralExpression {
  toString() {
    return `${this.val}`;
  }
  analyze() {
    this.type = Type.BOOL;
  }
}

module.exports = BooleanLiteral;
