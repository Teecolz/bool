class Parameters {
  constructor(params) {
    this.params = params;
  }

  toString() {
    return `(params ${this.params.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = Parameters;
