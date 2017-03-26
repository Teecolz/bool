const Type = require('./type.js');

class ParameterDeclaration {
  constructor(name, type) {
    this.name = name;
    if (type.length > 0) {
      this.type = type[0];
    } else {
      this.type = Type.ARBITRARY;
    }
  }

  analyze(context) {
    context.addVariable(this.name, this);
  }

  toString() {
    return `${this.name}`;
  }
}

module.exports = ParameterDeclaration;
