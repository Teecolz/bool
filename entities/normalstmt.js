class NormalStatement {
  constructor(stmt) {
    this.stmt = stmt[0];
  }

  analyze(context) {
    // stmt array can be 0 or 1 element
    if (this.stmt && this.stmt.length > 0) {
      this.stmt[0].analyze(context);
    }
  }

  toString() {
    return `${this.stmt}`;
  }
}

module.exports = NormalStatement;
