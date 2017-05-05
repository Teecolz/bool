const Type = require('./type.js');

class OpAssignment {
  constructor(id, op, val) {
    this.id = id;
    this.op = op;
    this.source = val;
  }
  analyze(context) {
    this.target = context.lookupVariable(this.id);
    this.source.analyze(context);

    if (this.op === '+=') {
      if (this.target.type.isInt() || this.target.type.isFloat()) {
        const errorMessage = 'Source is of wrong type. expected a number';
        this.source.type.mustBeNumber(errorMessage, this.source);
      } else if (this.target.type.isString()) {
        this.source.type = Type.STRING;
      }
    } else if (this.op === '%=') {
      let errorMessage = `Target of assignment operator ${this.op} must be integer.`;
      this.target.mustBeInteger(errorMessage, this.target);
      errorMessage = `Source of assignment operator ${this.op} must be integer.`;
      this.source.mustBeInteger(errorMessage, this.source);
    } else {
      let errorMessage = `Target of assignment ${this.op} must be number.`;
      this.target.type.mustBeNumber(errorMessage, this.target);
      errorMessage = `Source of assignment ${this.op} must be number.`;
      this.source.type.mustBeNumber(errorMessage, this.source);
    }
  }
  optimize() {
    this.source = this.source.optimize();
    this.target = this.target.optimize();
    return this;
  }
  toString() {
    return `${this.id} ${this.op} ${this.val}`;
  }
}

module.exports = OpAssignment;
