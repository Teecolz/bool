class MethodDeclaration {
  constructor(id, params, block) {
    this.id = id;
    this.params = params;
    this.block = block;
  }
  analyze(context) {
    const localContext = context.createFunctionContext();
    this.params.analyze(localContext);
    this.block.analyze(localContext);
  }
  toString() {
    return `(Method ${this.id} ${this.params} : ${this.block})`;
  }
}

module.exports = MethodDeclaration;
