class ConditionalStatement {
  constructor(cases, block) {
    this.cases = cases;
    this.block = block;
  }

  toString() {
    return `(If ${this.cases} ${this.block})`;
  }
}

module.exports = ConditionalStatement;
