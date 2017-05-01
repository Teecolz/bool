class ConstructorDeclaration {
  constructor(params, body) {
    this.id = 'build';
    this.params = params;
    this.body = body || undefined;
  }
  analyze(context) {
    const builderContext = context.createConstructorContext();
    this.params.analyze(builderContext);
    if (this.body) {
      this.body.analyze(builderContext);
    }
  }
  optimize() {
    if (this.body) {
      this.body = this.body.optimize();
    }
    return this;
  }
  toString() {
    return `(Build ${this.params}${this.body ? this.body : ''})`;
  }
}

module.exports = ConstructorDeclaration;
