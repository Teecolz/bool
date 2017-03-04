class DoUntilStatement {
  constructor(doSuite, until) {
    this.doSuite = doSuite;
    this.until = until;
  }

  toString() {
    return `(DoUntil (Do: ${this.doSuite}), (Until: ${this.until}))`;
  }
}

module.exports = DoUntilStatement;
