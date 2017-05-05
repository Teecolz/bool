class ListLiteral {
  constructor(exp) {
    this.exp = exp;
  }
  analyze(context) {
    if (this.exp.length > 0) {
      this.elements = this.exp[0];
      this.elements.analyze(context);
      this.type = this.elements.type;
      this.elementType = this.elements.elementType;
    }
  }
  optimize() {
    this.elements = this.elements.optimize();
    return this;
  }
  toString() {
    return `[${this.exp}]`;
  }
}

module.exports = ListLiteral;
