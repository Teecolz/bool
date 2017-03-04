class VariableAssignment {
  constructor(id, val) {
    this.id = id;
    this.val = val;
  }

  toString() {
    return `(VarAssign ${this.id} = ${this.val})`;
  }
}

module.exports = VariableAssignment;
