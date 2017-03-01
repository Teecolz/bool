class ListLiteral {
  constructor(elements) {
    this.elements = elements;
  }
  toString() {
    return `[${this.elements}]`;
  }
}

module.exports = ListLiteral;
