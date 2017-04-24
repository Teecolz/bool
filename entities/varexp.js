const Type = require('./type.js');

class VariableExpression {
  constructor(id) {
    this.id = id;
  }
  setType(context, type) {
    this.type = type;
  }
  analyze(context) {
    this.referent = context.lookupVariable(this.id);
    this.type = this.referent.type;
  }
  toString() {
    return `${this.id}`;
  }
}

module.exports = VariableExpression;
