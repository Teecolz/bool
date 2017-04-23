/* eslint-env node */

class ConditionalStatement {
  constructor(cases, block) {
    this.cases = cases;
    this.block = block;
  }
  analyze(context) {
    for (const curCase of this.cases) {
      curCase.analyze(context);
    }
    for (const stmt of this.block) {
      stmt.analyze(context);
    }
  }
  toString() {
    const out = `(Conditional ${this.cases.join(', ').replace(/, $/, '')}, ${this.block})`;
    return out.replace(/, \)$/, ')');
  }
}

module.exports = ConditionalStatement;
