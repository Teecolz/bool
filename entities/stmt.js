class Statement {
  constructor(stmt) {
    this.stmt = stmt;
  }
  analyze(context) {
    this.stmt.analyze(context);
    this.isReturn = this.stmt.isReturn;
    if (this.isReturn) {
      this.type = this.stmt.type;
    }
  }
  optimize() {
    return this.stmt.optimize();
  }
  toString() {
    return `${this.stmt}`;
  }
}

module.exports = Statement;
