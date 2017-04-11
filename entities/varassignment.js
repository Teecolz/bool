class VariableAssignment {
  constructor(id, exp) {
    this.target = id;
    this.source = exp;
  }

  analyze(context) {
    this.target.analyze(context);
    this.source.analyze(context);

    const errorMessage = `Incompatible types: Expected ${this.target.type.name}, got ${this.source.type.name}`;
    this.target.type.mustBeCompatibleWith(this.source.type, errorMessage, this.target);

    context.addVariable(this.target.name, this.source);
  }

  toString() {
    return `(= ${this.target} ${this.source})`;
  }
}

module.exports = VariableAssignment;
