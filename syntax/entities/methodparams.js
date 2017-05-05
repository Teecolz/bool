const FieldDeclaration = require('./fielddecl.js');

class MethodParameters {
  constructor(params) {
    this.params = params;
    this.length = params.length;
  }
  analyze(context) {
    const errorMessage = 'Cannot use field parameters outside of class context';
    context.mustBeClassContext(this.params, errorMessage);
    this.params.forEach((param) => {
      param.analyze(context);
      if (param instanceof FieldDeclaration) {
        context.parent.addVariable(param.id, param); // add field to parent context
      } else {
        context.addVariable(param.id, param);
      }
    });
  }
  optimize() {
    this.params = this.params.map(p => p.optimize());
    return this;
  }
  toString() {
    return `(Params ${this.params})`;
  }
}

module.exports = MethodParameters;
