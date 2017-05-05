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
    this.body = this.body.filter(s => s !== '').map(stmt => stmt.optimize());
    return this;
  }
  toString() {
    return `(Block ${this.body.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Block;
