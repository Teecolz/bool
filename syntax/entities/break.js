class Break {
  constructor(text) {
    this.stmt = text;
  }
  analyze(context) {
    context.mustBeLoopContext(this);
  }
  toString() {
    return `${this.stmt}`;
  }
  optimize() {
    return this;
  }
}

module.exports = Break;
