class ClassDeclaration {
  constructor(id, isa, body) {
    this.id = id;
    this.isa = isa;
    this.body = body;
  }

  toString() {
    return `(ClassDecl ${this.id} ${this.isa} : ${this.body})`.replace(/, \)$/, '');
  }
}

module.exports = ClassDeclaration;
