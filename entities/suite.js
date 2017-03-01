class Suite {
  constructor(statements) {
    this.body = statements;
  }

  toString() {
    return `(Suite ${this.body})`;
  }
}

module.exports = Suite;
