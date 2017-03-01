class ClassDeclaration {
  constructor(id, isa, _, fields, methods) {
    this.id = id;
    this.isa = isa;
    this.fields = fields;
    this.methods = methods;
  }

  toString() {
    return `(ClassDecl ${this.id} ${this.isa} ${this.fields} ${this.methods})`;
  }
}

module.exports = ClassDeclaration;
