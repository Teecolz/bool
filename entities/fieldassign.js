class FieldAssignment {
  constructor(id, exp) {
    this.target = id;
    this.source = exp;
  }
  analyze(context) {
    context.mustBeClassContext('Cannot assign field outside of class');
    this.target.analyze(context);
    this.source.analyze(context);
    const errorMessage = `Incompatible types: Expected ${this.target.type.name}, got ${this.source.type.name}`;
    this.target.type.mustBeCompatibleWith(this.source.type, errorMessage, this.target.type);
    context.addVariable(this.target.name, this.source);
  }
  toString() {
    return (this.id ? `(= _${this.id}, ${this.source})` : '(Field )');
  }
}

module.exports = FieldAssignment;
