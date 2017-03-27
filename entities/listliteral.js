const Type = require('./type.js');

class ListLiteral {
  constructor(elements) {
    this.elements = elements;
  }
  analyze(context) {
    if (this.elements.length > 0) {
      const el = this.elements[0];
      el.analyze(context);
      this.type = el.type;
    }
  }
  toString() {
    return `[${this.elements}]`;
  }
}

module.exports = ListLiteral;
