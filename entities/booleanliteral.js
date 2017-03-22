const LiteralExpression = require('./literalexpression.js');
const Type = require('../entities/type.js');

class BooleanLiteral extends LiteralExpression {
  toString() {
    return `${this.val}`;
  }
  analyze(context) {
    this.type = new Type('bool');
  }
}

module.exports = BooleanLiteral;
