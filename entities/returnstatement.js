const Type = require('./type.js');

class ReturnStatement {
  constructor(expression) {
    this.returnValue = expression[0] || undefined;
  }
  analyze(context) {
    context.mustBeFunctionContext(this);
    if (this.returnValue) {
      this.returnValue.analyze(context);
      this.type = this.returnValue.type;
    } else {
      this.type = Type.ARBITRARY;
    }
    this.isReturn = true;
  }
  toString() {
    return `(Return ${this.returnValue})`;
  }
}

module.exports = ReturnStatement;
