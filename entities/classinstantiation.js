class ClassInstantiation {
  constructor(id, params) {
    this.id = id;
    this.params = params;
  }

  toString() {
    return `(New ${this.id} ${this.params})`;
  }
}

module.exports = ClassInstantiation;
