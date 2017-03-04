class VariableDeclaration {
  constructor(id, type, assign) {
    this.id = id;
    this.type = type;
    this.assign = assign;
  }

  toString() {
    const idType = [this.id, this.type];
    return `(VarDecl ${idType.join(':').replace(/:$/, '')}${this.assign})`;
  }
}

module.exports = VariableDeclaration;
