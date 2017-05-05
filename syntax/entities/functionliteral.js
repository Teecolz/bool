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
    if (!(this.body instanceof Suite)) {
      const curErrorCount = error.count;
      if (this.returnType) {
        const errorMessage = `Incompatible return type: Expected ${this.returnType}, got ${this.body.type}`;
        this.returnType.mustBeCompatibleWith(this.body.type, errorMessage, this.body);
      } else {
        this.returnType = Type.ARBITRARY;
      }
      if (error.count > curErrorCount) {
        this.returnType = Type.ARBITRARY;
      }
      this.returnValue = this.body;
    } else if (this.returnType) {
        /* If we declare a type for our literal, all returns within its
           immediate scope must be of that type */
      let errorMessage;
      const curErrorCount = error.count;
      this.body.returnStatements.forEach((ret) => {
        const retStmt = ret.stmt;
        errorMessage = `Incompatible return type: Expected ${this.returnType}, got ${retStmt.type}`;
        this.returnType.mustBeCompatibleWith(retStmt.type, errorMessage, ret);
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
    if (this.body) {
      this.body = this.body.optimize();
    }
    return this;
  }
  toString() {
    return `(Funlit ${this.params} : ${this.body})`;
  }
}

module.exports = FunctionLiteral;
