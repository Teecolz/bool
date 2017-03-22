class VariableDeclaration {
  constructor(id, type, exp) {
    this.name = id;
    this.type = type[0];
    this.value = exp[0];
  }

  analyze(context) {
    context.mustNotBeLocal(this.name); // cannot already be declared in local scope
    this.value.analyze(context);
    this.mustHaveCompatibleTypes();
    context.addVariable(this.name, this);
  }

  mustHaveCompatibleTypes() {
    const errorMessage = `Incompatible Types: Declared ${this.type.name}, Assigned ${this.value.type.name}`;
    this.type.mustBeCompatibleWith(this.value.type, errorMessage, this.name);
  }

  toString() {
    return `(VarDecl ${this.name} ${this.type} ${this.value})`;
  }
}

module.exports = VariableDeclaration;
