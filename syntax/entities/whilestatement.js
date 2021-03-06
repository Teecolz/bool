class WhileStatement {
  constructor(condition, block) {
    this.condition = condition;
    this.body = block;
  }
  analyze(context) {
    // ensure condition expression evaluates to boolean
    this.condition.analyze(context);
    const errorMessage = `Conditional expression must evaluate to boolean. Found ${this.condition.type}`;
    this.condition.type.mustBeBoolean(errorMessage, this.condition);
    const localContext = context.createLoopContext();
    this.body.analyze(localContext);
    this.returnStatements = [].concat(this.body.returnStatements);
  }
  optimize() {
    this.condition = this.condition.optimize();
    this.body = this.body.optimize();
    return this;
  }
  toString() {
    return `(while ${this.condition} ${this.body})`;
  }
}

module.exports = WhileStatement;
