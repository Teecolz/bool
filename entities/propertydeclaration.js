const Type = require('./type.js');

class PropertyDeclaration {
  constructor(key, type, val) {
    this.id = key;
    this.type = type[0] || Type.ARBITRARY;
    this.val = val;
  }
  analyze(context) {
    this.name = `${this.id}`;
    context.mustNotBeLocal(this.name);
    this.val.analyze(context);
    const errorMessage = `Incompatible types: Expected ${this.type}, Got ${this.val.type}`;
    this.type.mustBeCompatibleWith(this.val.type, errorMessage, this.val.type);
    if (!this.type.isCompatibleWith(this.val.type)) {
      this.type = Type.ARBITRARY;
    } else if (this.type.isArbitrary()) {
      this.type = this.val.type;
      // TODO: coercion of floats to ints?
    }
    context.addVariable(this.name, this);
  }
  toString() {
    return `(PropDecl ${this.id} : ${this.val})`;
  }
}

module.exports = PropertyDeclaration;
