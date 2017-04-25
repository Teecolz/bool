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

  toString() {
    return `(Block ${this.body.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Block;
