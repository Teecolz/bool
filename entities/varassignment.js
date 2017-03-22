class VariableAssignment {
  constructor(id, exp) {
    this.name = id;
    this.val = exp;
  }

  analyze(context) {
    this.name.analyze(context);
    this.val.analyze(context);
    this.type.mustBeCompatibleWith(this.val.type);
  }

  toString() {
    return `(= ${this.left} ${this.right})`;
  }
}

module.exports = VariableAssignment;
