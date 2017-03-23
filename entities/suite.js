class Suite {
  constructor(statements) {
    this.stmts = statements;
  }
  analyze(context) {
    const localContext = context.createChildContext();
    for (let stmt of this.stmts) {
      stmt.analyze(localContext);
    }
  }
  toString() {
    return `(Suite ${this.stmts.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Suite;
