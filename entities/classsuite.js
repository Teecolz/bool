class ClassSuite {
  constructor(body) {
    this.body = body;
  }


  toString() {
    return `(ClassSuite ${this.body})`;
  }
}

module.exports = ClassSuite;
