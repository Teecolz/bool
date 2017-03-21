class VariableDeclaration {
  constructor(varexp, exp) {
    this.left = varexp;
    this.right = exp;
  }

  toString() {
    return `(VarDecl ${this.left} ${this.right})`;
  }
}

module.exports = VariableDeclaration;
