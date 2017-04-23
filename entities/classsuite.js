class ClassSuite {
  constructor(body) {
    this.body = body;
  }

  analyze(context) {
    this.body.analyze(context);
  }

  toString() {
    return `(ClassSuite ${this.body})`;
  }
}

module.exports = ClassSuite;
