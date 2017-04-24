const error = require('./error.js');
const Undefined = require('./entities/undefined.js');
const FunctionDeclaration = require('./entities/fundecl.js');
const ParamDecl = require('./entities/paramdecl.js');
const Parameters = require('./entities/params.js');
const IdLiteral = require('./entities/idliteral.js');

class AnalysisContext {
  constructor(parent) {
    this.parent = parent;
    this.symTable = {};
  }

  createChildContext() {
    return new AnalysisContext(this);
  }

  createFunctionContext() {
    const funContext = new AnalysisContext(this);
    funContext.isFunctionContext = true;
    return funContext;
  }

  mustNotBeLocal(name) {
    if (this.symTable[name]) {
      error(`Cannot redeclare variable ${name} in this scope`, name);
    }
  }

  lookupFunction(name) {
    const func = this.symTable[name];
    if (func) {
      return func;
    }

    return false;
  }

  lookupVariable(name) {
    const variable = this.symTable[name];
    if (variable) {
      return variable;
    } else if (!this.parent) {
      return error(`Variable ${name} not yet declared`, name);
    }

    return this.parent.lookupVariable(name);
  }

  lookupProperty(name) {
    const variable = this.symTable[name];
    if (variable) {
      return variable;
    }

    return new Undefined();
  }
  addVariable(name, entity) {
    this.symTable[name] = entity;
  }
}

exports.LIBRARY = new AnalysisContext(null);
new FunctionDeclaration('print', [], new Parameters([new ParamDecl('_', [])]), null).analyze(exports.LIBRARY);
exports.initialContext = new AnalysisContext(exports.LIBRARY);
