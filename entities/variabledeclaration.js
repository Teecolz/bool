class VariableDeclaration {
  constructor(id, val) {
    this.id = id;
    this.val = val;
  }

  toString() {
    return `(VarDecl ${this.id} = ${this.val})`;
  }
}

module.exports = VariableDeclaration;
