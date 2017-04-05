class DoUntilStatement {
  constructor(doSuite, until) {
    this.doSuite = doSuite;
    this.untilExp = until;
  }

  analyze(context) {
    this.doSuite.analyze(context);
    this.untilExp.analyze(context);
    const errorMessage = `Until expression must evaluate to boolean. Found ${this.untilExp.type}`;
    this.untilExp.type.mustBeBoolean(errorMessage, this.untilExp);
  }
  toString() {
    return `(DoUntil (Do: ${this.doSuite}), (Until: ${this.until}))`;
  }
}

module.exports = DoUntilStatement;
