class IfStatement {
  constructor(expression, block, branches) {
    this.condition = expression;
    this.body = block;
    this.branches = branches;
  }

  toString() {
    return `(If ${this.condition} ${this.body} ${this.branches})`;
  }
}

module.exports = IfStatement;
