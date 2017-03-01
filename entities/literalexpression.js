class LiteralExpression {
  constructor(val) {
    this.val = val;
  }
  toString(prefix) {
    return `(${prefix} ${this.val})`;
  }
}

module.exports = LiteralExpression;
