class FunctionCall {
  constructor(id, params) {
    this.id = id;
    this.params = params;
  }

  toString() {
    return `(FunCall ${this.id} ${this.params.join(', ').replace(/, $/, '')})`;
  }
}

module.exports = FunctionCall;
