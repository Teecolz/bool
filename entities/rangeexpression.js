const IntegerLiteral = require('./intliteral.js');
const IdLiteral = require('./idliteral.js');
const Type = require('./type.js');

class RangeExpression {
  constructor(start, end, step) {
    if (end.length === 0) {
      this.start = new IntegerLiteral('0');
      this.end = start;
      this.step = new IntegerLiteral('1');
    } else if (step[0].length === 0) {
      this.start = start;
      this.end = end[0];
      this.step = new IntegerLiteral('1');
    } else {
      this.start = start;
      this.end = end[0];
      this.step = step[0];
    }
  }

  analyze(context) {
    const errorMessage = 'Cannot create non-integral range.';
    if (this.start instanceof IdLiteral) {
      const startVal = context.lookupVariable(this.start.id);
      this.start = startVal;
      startVal.type.mustBeInteger(errorMessage, this.start);
    }
    if (this.end instanceof IdLiteral) {
      const endVal = context.lookupVariable(this.end.id);
      this.end = endVal;
      endVal.type.mustBeInteger(errorMessage, this.start);
    }
    if (this.step instanceof IdLiteral) {
      const stepVal = context.lookupVariable(this.step.id);
      this.step = stepVal;
      stepVal.type.mustBeInteger(errorMessage, this.start);
    }
    this.type = Type.Construct('[int]');
    this.elementType = Type.INT;
  }

  optimize() {
    return this;
  }
  toString() {
    return `(Range ${this.start}, ${this.end}, ${this.step})`.replace(/(, )*\)$/, ')');
  }
}

module.exports = RangeExpression;
