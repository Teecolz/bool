const Type = require('./type.js');

class MethodDeclaration {
  constructor(id, params, block) {
    this.id = id;
    this.params = params;
    this.block = block;
  }
  analyze(context) {
    context.mustNotBeLocal(this.id);
    const localContext = context.createFunctionContext();
    this.params.analyze(localContext);
    this.block.analyze(localContext);
    this.type = Type.FUNCTION;
    if (this.block && this.block.type) {
      if (this.returnType) {
        this.returnType.mustBeCompatibleWith(this.block.type, `Incompatible return type. Expected ${this.returnType}, got ${this.block.type}.`, this.returnType);
      }
      this.returnType = this.block.type;
      this.returnValue = this.block.returnValue;
    } else {
      this.returnType = Type.ARBITRARY;
    }
    context.addVariable(this.id, this);
  }
  optimize() {
    this.block = this.block.optimize();
    return this;
  }
  toString() {
    return `(Method ${this.id} ${this.params} : ${this.block})`;
  }
}

module.exports = MethodDeclaration;
