const error = require('./error.js');
const Undefined = require('./entities/undefined.js');
const FunctionDeclaration = require('./entities/fundecl.js');
const ParamDecl = require('./entities/paramdecl.js');
const Parameters = require('./entities/params.js');

class AnalysisContext {
  constructor(parent) {
    this.parent = parent;
    this.symTable = {};
  }
  createChildContext() {
    return new AnalysisContext(this);
  }
  createClassContext() {
    const classContext = new AnalysisContext(this);
    classContext.isClassContext = true;
    return classContext;
  }
  createConstructorContext() {
    const constructorContext = new AnalysisContext(this);
    constructorContext.isConstructorContext = true;
    return constructorContext;
  }
  createFunctionContext() {
    const funContext = new AnalysisContext(this);
    funContext.isFunctionContext = true;
    return funContext;
  }
  createLoopContext() {
    const loopContext = new AnalysisContext(this);
    loopContext.isLoopContext = true;
    return loopContext;
  }

  mustNotBeLocal(name) {
    if (this.symTable[name]) {
      error(`Cannot redeclare variable ${name} in this scope`, name);
    }
  }
  mustBeClassContext(location, message) {
    if (!this.isClassContext) {
      if (this.parent) {
        this.parent.mustBeClassContext(location, message);
      } else {
        const errorMessage = message || 'Cannot use fields outside of class context';
        error(errorMessage, location);
      }
    }
  }

  mustBeFunctionContext(location) {
    if (!this.isFunctionContext) {
      if (this.parent) {
        this.parent.mustBeFunctionContext();
      } else {
        error('Cannot call return statement from outside function context', location);
      }
    }
  }

  mustBeLoopContext(location) {
    if (!this.isLoopContext) {
      if (this.parent) {
        this.parent.mustBeLoopContext();
      } else {
        error('Cannot call break statement from outside loop context', location);
      }
    }
  }
  lookupFunction(name) {
    const func = this.symTable[name];
    if (func) {
      return func;
    }
    return false;
  }
  lookupField(name) {
    const variable = this.symTable[name];
    if (variable) {
      return variable;
    } else if (!this.parent) {
      return null;
    }
    return this.parent.lookupField(name);
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
new FunctionDeclaration('map', [], new Parameters([new ParamDecl('f', []), new ParamDecl('arr', [])]), null).analyze(exports.LIBRARY);
exports.initialContext = new AnalysisContext(exports.LIBRARY);
