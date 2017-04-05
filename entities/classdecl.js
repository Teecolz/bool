class ClassDeclaration {
  constructor(id, isa, body) {
    this.id = id;
    this.isa = isa;
    this.body = body;
  }

  analyze(context) {
    context.mustNotBeLocal(this.id);
    this.isa.analyze(context);
    this.body.analyze(context);
  }

  toString() {
    return `(ClassDecl ${this.id} ${this.isa} : ${this.body})`.replace(/, \)$/, '');
  }
}

module.exports = ClassDeclaration;
