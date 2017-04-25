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
}

module.exports = Break;
