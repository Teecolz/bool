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
        if (this.left.type.isInt() && this.right.type.isInt()) {
          this.type = Type.INT;
        } else {
          this.type = Type.FLOAT;
        }
        break;
      case '%':
        this.mustHaveIntegerOperands();
        this.type = Type.INT;
        break;
      case '>':
      case '>=':
      case '>==':
      case '<':
      case '<=':
      case '<==':
        this.mustHaveNumericalOperands();
        this.type = Type.BOOL;
        break;
      case '==':
      case '===':
      case '!=':
      case '!==':
        this.mustHaveCompatibleOperands();
        this.type = Type.BOOL;
        break;
      case '.':
        this.mustBeObject();
        this.type = this.left.referent.objectContext.lookupProperty(this.right);
        break;
      case '[]':
        this.mustBeObject();
        if (this.left.type.isObject()) { // object
          this.type = this.left.referent.objectContext.lookupProperty(this.right);
        } else { // list
          this.right.type.mustBeInteger('Cannot access non-integer index of list', this.op);
          this.type = this.left.elementType; // what if out of index?
        }
        break;
      default:
        break;
    }
  }
  mustBeObject() {
    const errorMessage = `Operator '${this.op}' requires left operand to be object`;
    this.left.type.mustBeObject(errorMessage, this.op);
  }
  mustHaveNumericalOperands() {
    const errorMessage = `Operator '${this.op}' requires numerical operands`;
    this.left.type.mustBeCompatibleWith(Type.INT, errorMessage, this.op);
    this.right.type.mustBeCompatibleWith(Type.INT, errorMessage, this.op);
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
