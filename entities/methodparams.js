const FieldDeclaration = require('./fielddecl.js');

class MethodParameters {
  constructor(params) {
    this.params = params;
  }
  analyze(context) {
    context.mustBeClassContext('Cannot use field parameters outside of class context');
    this.params.forEach((param) => {
      param.analyze(context);
      if (param instanceof FieldDeclaration) {
        context.parent.addVariable(param.id, param); // add field to parent context
      }
      context.addVariable(param.id, param);
    });
  }
  toString() {
    return `(Params ${this.params})`;
  }
}

module.exports = MethodParameters;
