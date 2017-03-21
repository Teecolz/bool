class VariableAssignment {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  toString() {
    return `(VarAssign ${this.left} ${this.right})`;
  }
}

module.exports = VariableAssignment;
