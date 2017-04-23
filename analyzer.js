const error = require('./error.js');
const Undefined = require('./entities/undefined.js');

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

exports.initialContext = new AnalysisContext(null);
