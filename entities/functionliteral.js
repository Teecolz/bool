class FunctionLiteral {
  constructor(params, body) {
    this.params = params;
    this.body = body;
  }

  toString() {
    return `(FunLit ${this.params} : ${this.body})`;
  }
}

module.exports = FunctionLiteral;
