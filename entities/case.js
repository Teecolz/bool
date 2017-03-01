class Case {
  constructor(condition, block) {
    this.condition = condition;
    this.body = block;
  }

  toString() {
    return `(Case ${this.condition} ${this.body})`;
  }
}

module.exports = Case;
