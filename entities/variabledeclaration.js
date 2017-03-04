class VariableDeclaration {
  constructor(id, type, val) {
    this.id = id;
    this.type = type;
    this.val = val;
  }

  toString() {
    const idType = [this.id, this.type];
    return `(VarDecl ${idType.join(' ').trim(' ')} = ${this.val})`;
  }
}

module.exports = VariableDeclaration;
