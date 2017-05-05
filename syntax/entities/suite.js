class Suite {
  constructor(statements) {
    this.stmts = statements;
  }
  analyze(context) {
    this.returnStatements = [];
    this.stmts.forEach((stmt) => {
      if (stmt) {
        stmt.analyze(context);
        if (stmt.isReturn) {
          this.returnStatements.push(stmt);
          this.type = stmt.type;
          this.returnValue = stmt.stmt.returnValue;
        } else if (stmt.stmt.returnStatements) {
          this.returnStatements = this.returnStatements.concat(stmt.stmt.returnStatements);
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
