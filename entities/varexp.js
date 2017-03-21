class VariableExpression {
  constructor(id, type) {
    this.name = id;
    this.type = type;
  }

  toString() {
    return `(VarExp ${this.name} ${this.type})`;
  }
}

module.exports = VariableExpression;
