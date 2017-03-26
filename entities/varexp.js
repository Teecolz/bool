const Type = require('./type.js');

class VariableExpression {
  constructor(id) {
    this.name = id;
  }

  analyze(context) {
    this.referent = context.lookupVariable(this.name);
    this.type = this.referent.type;
  }
  toString() {
    return `${this.name}`;
  }
}

module.exports = VariableExpression;
