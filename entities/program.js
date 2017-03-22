/* eslint-env node */
/* eslint spaced-comment: "off" */
const initialContext = require('../analyzer.js').initialContext;

class Program {
  constructor(block) {
    this.block = block;
  }
  analyze() {
    this.block.analyze(initialContext);
  }
  toString() {
    return `(Program ${this.block})`;
  }
}

module.exports = Program;
