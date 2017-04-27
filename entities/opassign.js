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
        this.source.type.mustBeNumber('Operand is of wrong type. expected a number', this.source);
      } else if (this.target.type.isString()) {
        this.source.type = Type.STRING;
      }
    } else if (this.op === '%=') {
      this.target.mustBeInteger('Target of assignment must be integer.', this.target);
      this.source.mustBeInteger('Source of assignment must be integer.', this.source);
    } else {
      this.target.type.mustBeNumber('Target of assignment must be number.', this.target);
      this.source.type.mustBeNumber('Source of assignment must be number.', this.source);
    }
  }

  toString() {
    return `${this.id} ${this.op} ${this.val}`;
  }
}

module.exports = OpAssignment;
