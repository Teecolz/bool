const error = require('./error.js');

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
      error(`Variable ${name} not yet declared`, name);
    } else {
      return this.parent.lookupVariable(name);
    }
  }

  addVariable(name, entity) {
    this.symTable[name] = entity;
  }
}

exports.initialContext = new AnalysisContext(null);