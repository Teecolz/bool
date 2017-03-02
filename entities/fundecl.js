class FunctionDeclaration {
  constructor(id, params, block) {
    this.id = id;
    this.params = params;
    this.body = block;
  }

  toString() {
    return `(Function ${this.id} ${this.params} : ${this.body})`;
  }
}

module.exports = FunctionDeclaration;
