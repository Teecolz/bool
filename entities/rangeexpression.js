class RangeExpression {
  constructor(start, end, step) {
    this.start = start;
    this.end = end;
    this.step = step;
  }
  toString() {
    return `(Range ${this.start}, ${this.end}, ${this.step})`.replace(/(, )*\)$/, ')');
  }
}

module.exports = RangeExpression;
