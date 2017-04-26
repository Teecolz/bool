class ConstructorDeclaration {
  constructor(params, body) {
    this.id = 'build';
    this.params = params;
    this.body = body ? body[0] : undefined;
  }

  analyze(context) {
    const builder = context.createFunctionContext();
    this.params.analyze(context);
    if (this.body) {
      this.body.analyze(builder);
    }
  } // TODO: HOW TO HANDLE INSTANTIATION

  toString() {
    return `(Build ${this.params}${this.body ? this.body : ''})`;
  }
}

module.exports = ConstructorDeclaration;
