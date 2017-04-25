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
    this.list.type.mustBeList('Cannot use for-in on non list.', this.list);
    this.type = this.list.type.getElementType();
    localContext.addVariable(this.iterator, this);
    this.block.analyze(localContext);
  }
  toString() {
    return `(for ${this.iterator} in ${this.list} : ${this.block})`;
  }
}

module.exports = ForStatement;
