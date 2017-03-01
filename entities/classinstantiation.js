class ClassInstantiation {
  constructor(call) {
    this.call = call;
  }

  toString() {
    return `(ClassInst ${this.call})`;
  }
}

module.exports = ClassInstantiation;
