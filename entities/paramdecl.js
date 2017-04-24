const Type = require('./type.js');

class ParameterDeclaration {
  constructor(id, type) {
    this.id = id;
    if (type.length > 0) {
      this.type = type[0];
    } else {
      this.type = Type.ARBITRARY;
    }
  }

  analyze(context) {
    context.addVariable(this.id, this);
  }

  toString() {
    return `${this.id}`;
  }
}

module.exports = ParameterDeclaration;
