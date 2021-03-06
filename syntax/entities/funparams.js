class FunctionParameters {
  constructor(params) {
    this.params = params;
    this.length = params.length;
  }

  analyze(context) {
    if (this.params.length > 0) {
      this.params.forEach((param) => {
        param.analyze(context);
      });
    }
  }
  optimize() {
    this.params = this.params.map(p => p.optimize());
    return this;
  }
  toString() {
    return `(FunParams ${this.params})`;
  }
}

module.exports = FunctionParameters;
