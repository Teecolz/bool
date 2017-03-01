class Parameters {
  constructor(params) {
    this.params = params;
  }

  toString() {
    return `(params ${this.params})`;
  }
}

module.exports = Parameters;
