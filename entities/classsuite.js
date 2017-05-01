class ClassSuite {
  constructor(body) {
    this.body = body;
  }

  analyze(context) {
    this.body.analyze(context);
  }
  optimize() {
    this.body = this.body.optimize();
    return this;
  }
  toString() {
    return `(ClassSuite ${this.body})`;
  }
}

module.exports = ClassSuite;
