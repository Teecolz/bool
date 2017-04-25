class ListLiteral {
  constructor(exp) {
    this.exp = exp;
  }
  analyze(context) {
    if (this.exp.length > 0) {
      const elements = this.exp[0];
      elements.analyze(context);
      this.type = elements.type;
      this.elementType = elements.elementType;
    }
  }
  toString() {
    return `[${this.exp}]`;
  }
}

module.exports = ListLiteral;
