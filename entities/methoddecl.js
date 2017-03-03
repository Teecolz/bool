class MethodDeclaration {
  constructor(id, params, block) {
    this.id = id;
    this.params = params;
    this.block = block;
  }

  toString() {
    return `(Method ${this.id} ${this.params} : ${this.block})`;
  }
}

module.exports = MethodDeclaration;
