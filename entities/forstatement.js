const VariableExpression = require('./varexp.js');

class ForStatement {
  constructor(id, list, block) {
    this.iterator = id;
    this.list = list;
    this.block = block;
    this.id = id;
  }
  analyze(context) {
    const localContext = context.createChildContext();
    this.list.analyze(localContext);
    this.list.type.mustBeList('Cannot use for-in on non list.', this.list);
    // assign element type to incrementing variable
    const incrementer = new VariableExpression(this.iterator);
    incrementer.type = this.list.type.getElementType();
    incrementer.referent = this;
    localContext.addVariable(this.iterator, incrementer);
    this.block.analyze(localContext);
  }
  toString() {
    return `(for ${this.iterator} in ${this.list} : ${this.block})`;
  }
}

module.exports = ForStatement;
