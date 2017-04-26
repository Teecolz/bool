class ClassBody {
  constructor(builder, methods) {
    this.builder = builder;
    this.methods = methods;
  }

  analyze(context) {
    this.builder.analyze(context);
    this.methods.forEach((m) => {
      m.analyze(context);
    });
  }

  toString() {
    return `(ClassBody ${this.builder} ${this.methods ? this.methods : ''})`;
  }
}

module.exports = ClassBody;
