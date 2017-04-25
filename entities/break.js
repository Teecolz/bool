class Break {
  constructor(text) {
    this.text = text;
  }
  analyze(context) {
    context.mustBeLoopContext(this);
  }
  toString() {
    return this.text;
  }
}

module.exports = Break;
