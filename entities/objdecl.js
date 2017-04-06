class ObjectDeclaration {
  constructor(id, properties) {
    this.id = id;
    this.propDecls = properties;
  }
  analyze(context) {
    context.mustNotBeLocal(this.id);
    const localContext = context.createChildContext();
    for (let i = 0; i < this.propDecls.length; i += 1) {
      this.propDecls[i].analyze(localContext);
    }
    context.addVariable(this.id, this);
  }
  toString() {
    return `(ObjDecl ${this.id} ${this.propDecls})`;
  }
}

module.exports = ObjectDeclaration;
