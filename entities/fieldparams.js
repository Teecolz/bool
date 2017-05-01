class FieldParameters {
  constructor(params) {
    this.params = params;
  }
  analyze(context) {
    context.mustBeClassContext('Cannot use field parameters outside of class context');
    this.params.forEach((fd) => {
      fd.analyze(context);
    });
  }
  optimize() {
    return this;
  }
  toString() {
    return `(Params ${this.params})`;
  }
}

module.exports = FieldParameters;
