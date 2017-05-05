const Type = require('./type.js');

class VariableExpression {
  constructor(id, referent) {
    this.id = id;
    if (referent) { this.referent = referent; }
  }
  setType(context, type) {
    this.type = type;
  }
  analyze(context) {
    this.referent = context.lookupVariable(this.id);
    if (this.referent) {
      this.type = this.referent.type;
    } else {
      this.type = Type.ARBITRARY;
    }
  }
  optimize() {
    return this;
  }
  toString() {
    return `${this.id}`;
  }
}

module.exports = VariableExpression;
