class DoWhileStatement {
  constructor(body, whileExp) {
    this.body = body;
    this.whileExp = whileExp;
  }
  analyze(context) {
    this.body.analyze(context);
    this.whileExp.analyze(context);
    const errorMessage = `While expression must evaluate to boolean. Found ${this.whileExp.type}`;
    this.whileExp.type.mustBeBoolean(errorMessage, this.whileExp);
  }
  toString() {
    return `(DoWhile (Do: ${this.body}) (While: ${this.whileExp}))`;
  }
}

module.exports = DoWhileStatement;
