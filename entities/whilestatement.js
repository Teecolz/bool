class WhileStatement {
  constructor(condition, block) {
    this.condition = condition;
    this.body = block;
  }

  toString() {
    return `(while ${this.condition} ${this.body})`;
  }
}

module.exports = WhileStatement;
