class IndentStatement {
  constructor(stmt) {
    this.stmt = stmt;
  }

  analyze(context) {
    this.stmt.analyze(context);
  }

  toString() {
    return `${this.stmt}`;
  }
}

module.exports = IndentStatement;
