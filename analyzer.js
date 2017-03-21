const error = require('./error.js');

class AnalysisContext {
  constructor(parent) {
    this.parent = parent;
    this.symTable = {};
  }

  createChildContext() {
    return new AnalysisContext(this);
  }

  lookupVariable(name) {
    const variable = this.symTable[name];
    if (variable) {
      return variable;
    } else if (!this.parent) {
      error(`Variable ${name} not yet declared`, name);
    } else {
      this.parent.lookupVariable(name);
    }
  }

  addVariable(name, entity) {
    this.symTable[name] = entity;
  }
}

exports.initialContext = new AnalysisContext(null);
