const Suite = require('./suite.js');
const Type = require('./type.js');
const error = require('../../error');
class FunctionLiteral {
  constructor(params, body, returnType) {
    this.params = params;
    this.body = body;
    this.returnType = returnType[0];
  }
  analyze(context) {
    const localContext = context.createFunctionContext();
    this.params.analyze(localContext);
    this.body.analyze(localContext);
    this.returnType = Type.ARBITRARY;
    if (!(this.body instanceof Suite)) {
      this.returnType = this.body.type;
      this.returnValue = this.body;
    } else if (this.returnType) {
        /* If we declare a type for our literal, all returns within its
           immediate scope must be of that type */
      let errorMessage;
      const curErrorCount = error.count;
      this.body.returnStatements.forEach((ret) => {
        errorMessage = `Incompatible types: Expected ${this.returnType}, got ${ret.type}`;
        this.returnType.mustBeCompatibleWith(ret.type, errorMessage, ret);
      });
      if (error.count > curErrorCount) {
          /* We know that there was a conflicting return statement type, so set
             the function's return type to arbitrary */
        this.returnType = Type.ARBITRARY;
      }
    }
    this.type = Type.FUNCTION;
  }
  optimize() {
    this.body = this.body.optimize();
    return this;
  }
  toString() {
    return `(Funlit ${this.params} : ${this.body})`;
  }
}

module.exports = FunctionLiteral;
