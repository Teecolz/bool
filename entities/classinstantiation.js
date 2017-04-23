class ClassInstantiation {
  constructor(id, params) {
    this.id = id;
    this.params = params;
  }

  analyze(context) {
    this.id.analyze(context);
    this.params.analyze(context);
  }

  toString() {
    return `(New ${this.id} ${this.params})`;
  }
}

module.exports = ClassInstantiation;
