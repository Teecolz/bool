const Suite = require('./suite.js');
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
    if (!(this.body instanceof Suite)) {
      this.returnType = this.body.type;
      this.returnValue = this.body;
    } else if (this.body.type) {
      this.returnType = this.body.type;
      this.returnValue = this.body.returnValue;
    }
    this.type = Type.FUNCTION;
  }
  toString() {
    return `(Funlit ${this.params} : ${this.body})`;
  }
}

module.exports = FunctionLiteral;
