class SimpleIf {
  constructor(exp) {
    this.exp = exp;
  }
  analyze(context) {
    this.exp.analyze(context);
    this.exp.type.mustBeBoolean('Conditional expression must evaluate to boolean', this.exp);
  }
  toString() {
    return `(If ${this.exp})`;
  }
}

module.exports = SimpleIf;
