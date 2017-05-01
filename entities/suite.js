class Suite {
  constructor(statements) {
    this.stmts = statements;
  }
  analyze(context) {
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

  optimize() {
    this.stmts = this.stmts.map(s => s.optimize());
    return this;
  }

  toString() {
    return `(Suite ${this.stmts.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Suite;
