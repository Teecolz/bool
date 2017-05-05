/* eslint-env node */
/* eslint spaced-comment: "off" */
const initialContext = require('../../semantics/analyzer.js').initialContext;

class Program {
  constructor(block) {
    this.block = block;
  }
  analyze() {
    this.block.analyze(initialContext);
  }
  optimize() {
    this.block = this.block.optimize();
  }
  toString() {
    return `(Program ${this.block})`;
  }
}

module.exports = Program;
