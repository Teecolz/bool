class ConditionalStatement {
  constructor(cases, block) {
    this.cases = cases;
    this.block = block;
  }

  toString() {
    const out = `(Conditional ${this.cases.join(', ').replace(/, $/, '')}, ${this.block})`;
    return out.replace(/, \)$/, ')');
  }
}

module.exports = ConditionalStatement;
