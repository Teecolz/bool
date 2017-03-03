class FieldDeclaration {
  constructor(id) {
    this.id = id;
  }
  toString() {
    return (this.id ? `(Field _${this.id})` : '(Field )');
  }
}

module.exports = FieldDeclaration;
