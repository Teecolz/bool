class BinaryExpression {
  constructor(left, op, right) {
    this.left = left;
    this.op = op;
    this.right = right;
  }

  toString() {
    return `(BinExp ${this.left} ${this.op} ${this.right})`;
  }
}

module.exports = BinaryExpression;
