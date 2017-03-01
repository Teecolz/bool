class FunctionLiteral {
  constructor(params, body) {
    this.params = params;
    this.body = body;
  }

  toString() {
    return `(Funlit ${this.params} ${this.body})`;
  }
}

module.exports = FunctionLiteral;
