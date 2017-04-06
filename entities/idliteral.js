class IdLiteral {
  constructor(id) {
    this.id = id;
  }
  analyze() {
    this.name = this.id;
  }
  toString() {
    return `${this.id}`;
  }
}

module.exports = IdLiteral;
