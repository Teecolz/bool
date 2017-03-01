class StringLiteral {
  constructor(val) {
    this.val = val;
  }
  toString() {
    return `"${this.val}"`;
  }
}

module.exports = StringLiteral;
