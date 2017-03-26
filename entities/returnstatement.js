class ReturnStatement {
  constructor(expression) {
    this.returnValue = expression;
  }
  analyze(context) {
    this.returnValue.analyze(context);
    this.isReturn = true;
    this.type = this.returnValue.type;
  }
  toString() {
    return `(Return ${this.returnValue})`;
  }
}

module.exports = ReturnStatement;
