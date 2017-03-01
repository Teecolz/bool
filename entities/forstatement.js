class ForStatement {
  constructor(id, list, block) {
    this.iterator = id;
    this.list = list;
    this.block = block;
  }

  toString() {
    return `(for ${this.iterator} ${this.list} ${this.block})`;
  }
}

module.exports = ForStatement;
