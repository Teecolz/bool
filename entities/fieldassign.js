class FieldAssignment {
  constructor(id, exp) {
    this.target = id;
    this.source = exp;
  }
  analyze(context) {
    let errorMessage = 'Cannot assign field outside of class context';
    context.mustBeClassContext(this.target, errorMessage);
    this.target.analyze(context);
    this.source.analyze(context);
    errorMessage = `Incompatible types: Expected ${this.target.type.name}, got ${this.source.type.name}`;
    this.target.type.mustBeCompatibleWith(this.source.type, errorMessage, this.target.type);
    context.addVariable(this.target.name, this.source);
  }
  optimize() {
    this.source = this.source.optimize();
    return this;
  }
  toString() {
    return (this.id ? `(= _${this.id}, ${this.source})` : '(Field )');
  }
}

module.exports = FieldAssignment;
