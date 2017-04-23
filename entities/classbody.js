class ClassBody {
  constructor(fields, methods) {
    this.fields = fields;
    this.methods = methods;
  }

  analyze(context) {
    this.fields.analyze(context);
    this.methods.analyze(context);
  }

  toString() {
    return `(ClassBody ${this.fields} ${this.methods})`;
  }
}

module.exports = ClassBody;
