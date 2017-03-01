class ClassBody {
  constructor(fields, methods) {
    this.fields = fields;
    this.methods = methods;
  }

  toString() {
    return `(ClassBody ${this.fields} ${this.methods})`;
  }
}

module.exports = ClassBody;
