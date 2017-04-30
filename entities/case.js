class Case {
  constructor(condition, block) {
    this.condition = condition;
    this.body = block;
  }

  analyze(context) {
    this.condition.analyze(context);
    this.condition.type.mustBeBoolean(`Condition must be of type 'bool'. Found type ${this.condition.type}`, this.condition);
    this.body.analyze(context);
  }


  optimize() {
    this.condition = this.condition.optimize();
    this.body = this.body.optimize();
    return this;
  }

  toString() {
    return `(Case ${this.condition}, ${this.body})`;
  }
}

module.exports = Case;
