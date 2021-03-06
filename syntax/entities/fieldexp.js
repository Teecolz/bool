const Type = require('./type.js');

class FieldExpression {
  constructor(id, referent) {
    this.id = id;
    if (referent) { this.referent = referent; }
  }
  setType(context, type) {
    this.type = type;
  }
  analyze(context) {
    const errorMessage = 'Cannot access field from outside of class';
    context.mustBeClassContext(this.id, errorMessage);
    this.referent = context.lookupField(this.id);
    if (this.referent) {
      this.type = this.referent.type;
    } else {
      this.type = Type.ARBITRARY;
      this.referent = this;
    }
  }
  optimize() {
    return this;
  }
  toString() {
    return `${this.id}`;
  }
}

module.exports = FieldExpression;
