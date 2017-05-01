class FieldParameters {
  constructor(params) {
    this.params = params;
  }
  analyze(context) {
    const errorMessage = 'Cannot declare field parameters outside of class context';
    context.mustBeClassContext(this.params, errorMessage);
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
