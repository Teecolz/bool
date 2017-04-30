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
    this.stmt = this.stmt.optimize();
    return this;
  }
  toString() {
    return `${this.stmt}`;
  }
}

module.exports = Statement;
