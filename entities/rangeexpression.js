const IntegerLiteral = require('./intliteral.js');

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
  toString() {
    return `(Range ${this.start}, ${this.end}, ${this.step})`.replace(/(, )*\)$/, ')');
  }
}

module.exports = RangeExpression;
