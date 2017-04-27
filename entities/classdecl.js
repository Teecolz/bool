const Type = require('./type.js');

class ClassDeclaration {
  constructor(id, isa, body) {
    this.id = id;
    this.isa = isa;
    this.body = body;
  }

  analyze(context) {
    context.mustNotBeLocal(this.id);
    const classContext = context.createClassContext();
    if (this.isa[0]) {
      this.superClass = context.lookupVariable(this.isa[0].id);
    }
    this.body.analyze(classContext);
    context.addVariable(this.id, this);
    this.type = Type.Construct(this.id);
  }

  toString() {
    return `(ClassDecl ${this.id} ${this.isa} : ${this.body})`.replace(/, \)$/, '');
  }
}

module.exports = ClassDeclaration;
