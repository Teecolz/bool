class ForStatement {
  constructor(id, list, block) {
    this.iterator = id;
    this.list = list;
    this.block = block;
    this.id = id;
  }
  analyze(context) {
    const localContext = context.createLoopContext();
    this.list.analyze(localContext);
    const errorMessage = 'Cannot use for-in on non list.';
    this.list.type.mustBeList(errorMessage, this.list);
    this.type = this.list.type.getElementType();
    localContext.addVariable(this.iterator, this);
    this.block.analyze(localContext);
    this.returnStatements = [].concat(this.block.returnStatements);
  }
  optimize() {
    this.list = this.list.optimize();
    this.block = this.block.optimize();
    return this;
  }
  toString() {
    return `(for ${this.iterator} in ${this.list} : ${this.block})`;
  }
}

module.exports = ForStatement;
