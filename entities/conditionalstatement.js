/* eslint-env node */

class ConditionalStatement {
  constructor(cases, block) {
    this.cases = cases;
    this.block = block;
  }
  analyze(context) {
    this.cases.forEach((curCase) => {
      curCase.analyze(context);
    });
    this.block.forEach((stmt) => {
      stmt.analyze(context);
    });
  }
  toString() {
    const out = `(Conditional ${this.cases.join(', ').replace(/, $/, '')}, ${this.block})`;
    return out.replace(/, \)$/, ')');
  }
}

module.exports = ConditionalStatement;
