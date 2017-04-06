class PropertyDeclaration {
  constructor(key, val) {
    this.key = key;
    this.val = val;
  }
  analyze(context) {
    this.name = this.key;
    context.mustNotBeLocal(this.name);
    this.val.analyze(context);
    this.type = this.val.type;
    context.addVariable(this.name, this);
  }
  toString() {
    return `(PropDecl ${this.key} : ${this.val})`;
  }
}

module.exports = PropertyDeclaration;
