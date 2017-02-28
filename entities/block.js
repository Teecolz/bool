/* eslint-env node */
/* eslint spaced-comment: "off" */

class Block {
  constructor(statements) {
    this.body = statements;
  }

  toString() {
    return `(Block ${this.body})`;
  }
}

module.exports = Block;
