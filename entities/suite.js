class Suite {
  constructor(statements) {
    this.stmts = statements;
  }
  analyze(context) {
    // const localContext = context.createChildContext();
    this.stmts.forEach((stmt) => {
      if (stmt) {
        stmt.analyze(context);
        if (stmt.isReturn) {
          this.type = stmt.type;
          this.returnValue = stmt.stmt.returnValue;
        }
      }
    });
  }
  toString() {
    return `(Suite ${this.stmts.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Suite;
