/* eslint-env node */
class ConditionalStatement {
  constructor(cases, block) {
    this.cases = cases;
    this.block = block[0];
  }
  analyze(context) {
    this.cases.forEach((curCase) => {
      curCase.analyze(context);
    });
    if (this.block) { this.block.analyze(context); }
  }
  optimize() {
    this.block = this.block ? this.block.optimize() : this.block;
    this.cases = this.cases.map(cases => cases.optimize());
    return this;
  }
  toString() {
    const out = `(Conditional ${this.cases.join(', ').replace(/, $/, '')}${this.block ? `, ${this.block}` : ''})`;
    return out.replace(/, \)$/, ')');
  }
}

module.exports = ConditionalStatement;
