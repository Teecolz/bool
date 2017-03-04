class SimpleIf {
  constructor(exp) {
    this.exp = exp;
  }
  toString() {
    return `(If ${this.exp})`;
  }
}

module.exports = SimpleIf;
