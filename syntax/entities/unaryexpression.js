const Type = require('./type.js');

class UnaryExpression {
  constructor(op, operand) {
    this.op = op;
    this.operand = operand;
  }
  analyze() {
    this.operand.analyze();
    this.operandMustHaveCompatibleType();
    if (this.op === '-') {
      this.type = this.operand.type;
    } else {
      this.type = Type.BOOL;
    }
  }
  optimize() {
    this.operand = this.operand.optimize();
    return this;
  }
  toString() {
    return `(UnExp ${this.op} ${this.operand})`;
  }
  operandMustHaveCompatibleType() {
    if (this.op === '-') {
      const errorMessage = 'Cannot negate non-number';
      this.operand.type.mustBeNumber(errorMessage, this.op);
    }
  }
}

module.exports = UnaryExpression;
