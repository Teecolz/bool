const Type = require('./type.js');
const error = require('../../error');

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
      if (!this.returnType.isArbitrary()) {
        const currentErrorCount = error.count;
        // make sure all return statements in the body match with type declared in function
        this.body.returnStatements.forEach((ret) => {
          const errorMessage = `Incompatible return type. Expected ${this.returnType}, got ${ret.type}}`;
          this.returnType.mustBeCompatibleWith(ret.type, errorMessage, ret.type);
        });
        if (error.count > currentErrorCount) {
          // If we have typing errors with our returns, assign arbitrary type to function return
          this.returnType = Type.ARBITRARY;
        }
      }
    }
    this.type = Type.FUNCTION;
    // If function returns a value, assign that value's type to function name
    // if (this.body) {
    //   if (this.returnType) {
    //     const errorMessage = `Incompatible return type. Expected ${this.returnType}, got ${this.body.type}.`;
    //     this.returnType.mustBeCompatibleWith(this.body.type, errorMessage, this.returnType);
    //   }
    //   this.returnType = this.body.type;
    //   this.returnValue = this.body.returnValue;
    // } else {
    //   this.returnType = Type.ARBITRARY; // may want to switch to void
    // }
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
