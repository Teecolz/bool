const Type = require('./type.js');
const VarExp = require('./varexp.js');

class VariableDeclaration {
  constructor(id, type, exp) {
    this.id = id;
    this.type = type[0];
    this.value = exp[0];
  }

  analyze(context) {
    context.mustNotBeLocal(this.id); // cannot already be declared in local scope
    if (this.value) {
      this.value.analyze(context);
    } else if (!this.Type) {
      this.type = Type.ARBITRARY;
    }
    if (!this.type) {
      this.type = this.value.type;
    } else if (this.value) {
      this.mustHaveCompatibleTypes();
    }

    context.addVariable(this.id, this);
  }

  mustHaveCompatibleTypes() {
    const errorMessage = `Incompatible Types: Declared ${this.type.id}, Assigned ${this.value.type.id}`;
    this.type.mustBeCompatibleWith(this.value.type, errorMessage, this.id);
  }

  toString() {
    return `(VarDecl ${this.id}:${this.type || '<no type>'}${this.value ? ` = ${this.value}` : ''})`;
  }
}

module.exports = VariableDeclaration;
