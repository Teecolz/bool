/* eslint-env node */
/* eslint spaced-comment: "off" */

class Block {
  constructor(statements) {
    this.body = statements;
  }

  analyze(context) {
    const localContext = context.createChildContext();
    this.body.forEach((stmt) => {
      if (stmt) {
        stmt.analyze(localContext);
      }
    });
  }
  optimize() {
    this.body = this.body.map((stmt) => {
      if (stmt) {
        return stmt.optimize();
      }
      return null;
    });
    return this;
  }
  toString() {
    return `(Block ${this.body.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Block;
