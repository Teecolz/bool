class Parens {
  constructor(exp) {
    this.exp = exp;
  }
  analyze(context) {
    this.exp.analyze(context);
  }
  optimize() {
    this.exp = this.exp.optimize();
    return this;
  }
  toString() {
    return `(Parens ${this.exp})`;
  }
}

module.exports = Parens;
