class Suite {
  constructor(statements) {
    this.body = statements;
  }

  toString() {
    return `(Suite ${this.body.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Suite;
