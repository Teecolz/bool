class FieldDeclaration {
  constructor(id) {
    this.id = id;
  }
  toString() {
    return `_${this.id}`;
  }
}

module.exports = FieldDeclaration;
