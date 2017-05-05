const Type = require('./type.js');

class FunctionDeclaration {
  constructor(id, type, params, block) {
    this.id = id;
    if (type[0]) {
      this.returnType = type[0];
    } else {
      this.returnType = Type.ARBITRARY;
    }
    this.params = params;
    this.body = block;
  }

  analyze(context) {
    context.mustNotBeLocal(this.id);
    const localContext = context.createFunctionContext();
    this.params.analyze(localContext);
    if (this.body) {
      this.body.analyze(localContext);
    }
    this.type = Type.FUNCTION;
    // If function returns a value, assign that value's type to function name
    if (this.body && this.body.type) {
      if (this.returnType) {
        const errorMessage = `Incompatible return type. Expected ${this.returnType}, got ${this.body.type}.`;
        this.returnType.mustBeCompatibleWith(this.body.type, errorMessage, this.returnType);
      }
      this.returnType = this.body.type;
      this.returnValue = this.body.returnValue;
    } else {
      this.returnType = Type.ARBITRARY; // may want to switch to void
    }
    this.localContext = localContext;
    context.addVariable(this.id, this);
  }
  optimize() {
    this.body = this.body.optimize();
    return this;
  }
  toString() {
    return `(Function ${this.id} ${this.params} : ${this.body})`;
  }
}

module.exports = FunctionDeclaration;
