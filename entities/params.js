class Parameters {
  constructor(params) {
    // Make sure empty arrays have length 0
    this.params = params === [[]] ? [] : params;
    this.length = params.length;
  }

  analyze(context) {
    for (let param of this.params) {
      param.analyze(context);
    }
  }

  toString() {
    return `(Params ${this.params.join(',').replace(/,$/, '')})`;
  }
}

module.exports = Parameters;
