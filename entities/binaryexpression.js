const Type = require('./type.js');

class BinaryExpression {
  constructor(left, op, right) {
    this.left = left;
    this.op = op;
    this.right = right;
  }

  analyze(context) {
    this.left.analyze(context);
    this.right.analyze(context);
    switch (this.op) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '//':
      case '**':
        this.mustHaveNumericalOperands();
        // how to handle operations that take int and float?
        this.type = new Type('float');
        break;
      case '%':
        this.mustHaveIntegerOperands();
        this.type = new Type('int');
        break;
      case '>':
      case '>=':
      case '>==':
      case '<':
      case '<=':
      case '<==':
        this.mustHaveNumericalOperands();
        this.type = new Type('bool');
        break;
      case '==':
      case '===':
      case '!=':
      case '!==':
        this.mustHaveCompatibleOperands();
        break;
      default:
        break;
    }
  }

  mustHaveNumericalOperands() {
    const errorMessage = `Operator '${this.op}' requires numerical operands`;
    this.left.type.mustBeCompatibleWith('int', errorMessage, this.op);
    this.right.type.mustBeCompatibleWith('int', errorMessage, this.op);
  }

  mustHaveIntegerOperands() {
    const errorMessage = `Operator '${this.op}' requires integer operands`;
    this.left.type.mustBeInteger(errorMessage, this.op);
    this.right.type.mustBeInteger(errorMessage, this.op);
  }

  mustHaveCompatibleOperands() {
    const errorMessage = `Operator '${this.op}' requires compatible operands`;
    this.left.type.mustBeCompatibleWith(this.right.type, errorMessage, this.op);
  }
  toString() {
    return `(BinExp ${this.left} ${this.op} ${this.right})`;
  }
}

module.exports = BinaryExpression;
