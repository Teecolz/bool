class Parameters {
  constructor(params) {
    // Make sure empty arrays have length 0
    this.params = params === [[]] ? [] : params;
    this.length = params.length;
  }
  analyze(context) {
    this.params.forEach((param) => {
      param.analyze(context);
    });
  }
  optimize() {
    this.params = this.params.map(p => p.optimize());
    return this;
  }
  toString() {
    return `(Params ${this.params.join(',').replace(/,$/, '')})`;
  }
}

module.exports = Parameters;
