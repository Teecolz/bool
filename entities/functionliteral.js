const Type = require('./type.js');

class FunctionLiteral {
  constructor(params, body) {
    this.params = params;
    this.body = body;
  }

  analyze(context) {
    const localContext = context.createFunctionContext();
    this.params.analyze(localContext);
    this.body.analyze(localContext);
    this.type = Type.Construct('function');
    // If function returns a value, assign that value's type to function
    if (this.body.type) {
      this.returnType = this.body.type;
    }
  }
  toString() {
    return `(Funlit ${this.params} : ${this.body})`;
  }
}

module.exports = FunctionLiteral;
