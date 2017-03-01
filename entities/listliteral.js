class ListLiteral {
  constructor(elements) {
    this.elements = elements;
  }
  toString() {
    return `(List ${this.elements})`;
  }
}

module.exports = ListLiteral;
