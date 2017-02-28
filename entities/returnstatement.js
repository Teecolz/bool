class ReturnStatement {
  constructor(expression) {
    this.returnValue = expression;
  }

  toString() {
    return `(Return ${this.returnValue})`;
  }
}

module.exports = ReturnStatement;
