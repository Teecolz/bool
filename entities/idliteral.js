class IdLiteral {
  constructor(id) {
    this.id = id;
  }
  analyze() {
    this.name = this.id;
  }
  optimize() {
    return this;
  }
  toString() {
    return `${this.id}`;
  }
}

module.exports = IdLiteral;
