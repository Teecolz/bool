class FullStatement {
  constructor(stmt) {
    this.stmt = stmt;
  }

  analyze(context) {
    // stmt array can be 0 or 1 element
    this.stmt[0].analyze(context);
  }

  toString() {
    return `${this.stmt}`;
  }
}

module.exports = FullStatement;
