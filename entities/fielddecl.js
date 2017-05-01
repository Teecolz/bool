const Type = require('./type.js');

class FieldDeclaration {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
  analyze(context) {
    context.mustBeClassContext('Cannot declare field outside of class');
    context.mustNotBeLocal(this.id); // cannot redeclare fields
    if (this.type[0]) {
      this.type.analyze(context); // is this right?
    } else {
      this.type = Type.ARBITRARY;
    }
  }
  optimize() {
    return this;
  }
  toString() {
    return (this.id ? `(Field ${this.id})` : '(Field )');
  }
}

module.exports = FieldDeclaration;
