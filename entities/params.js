class Parameters {
  constructor(params) {
    this.params = params;
  }

  toString() {
    return `(Params ${this.params.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Parameters;
