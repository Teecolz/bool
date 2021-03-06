const error = require('../../error.js');
const FunctionLiteral = require('./functionliteral.js');
const Type = require('./type.js');
const Undefined = require('./undefined.js');
const VariableExpression = require('./varexp.js');

class FunctionCall {
  constructor(id, params) {
    this.id = id;
    this.params = params;
  }
  toString() {
    return `(FunCall ${this.id} ${this.params.join(', ').replace(/, $/, '')})`;
  }
  analyze(context) {
    if (this.id instanceof FunctionLiteral) {
      this.id.analyze(context);
      this.callee = this.id;
    } else {
      this.callee = context.lookupVariable(`${this.id}`);
    }

    let curFun = this.callee; // ensure function defined within this scope
    let errorMessage;
    let isPhantomFunction; // avoid trying to access properties of fake function
    let paramLength;

    if (this.callee.type.isArbitrary()) {
      // if analyzing call for arbitary function, don't do much
      this.params.forEach(p => p.analyze(context));
      this.type = Type.ARBITRARY;
      return;
    }
    isPhantomFunction = false;
    // Cannot call non function
    if (!curFun.type.isFunction()) {
      errorMessage = 'Cannot call non-function as function';
      curFun.type.mustBeFunction(errorMessage, this.id);
      curFun.type = Type.FUNCTION; // make type compatible
      isPhantomFunction = true;
    } else if (curFun instanceof VariableExpression) {
      curFun = curFun.referent;
    }
    // only analyze first call, otherwise things get too complicated
    const paramGroup = this.params[0];
    paramGroup.analyze(context);
    paramLength = paramGroup.length;

    if (!isPhantomFunction) {
      errorMessage =
        `Function requires ${curFun.params.length} parameters. Given ${paramGroup.params.length}`;
      if (paramGroup.params.length !== curFun.params.length) {
        error(errorMessage, paramGroup);
      }

      // Only check up to minimum number of arguments
      paramLength =
        paramGroup.length > curFun.params.length ? curFun.params.length : paramGroup.length;

      // Check that types in call are compatible
      for (let j = 0; j < paramLength; j += 1) {
        errorMessage =
          `Incompatible types: Expected ${curFun.params.params[j].type}, got ${paramGroup.params[j].type}`;
        paramGroup.params[j].type.mustBeCompatibleWith(
          curFun.params.params[j].type,
          errorMessage,
          paramGroup.params[j]);
      }

      this.type = curFun.returnType;
      this.val = curFun.returnValue;
    } else {
      // Keep compatible types
      this.type = Type.ARBITRARY;
      this.val = new Undefined();
    }
  }
  optimize() {
    this.params = this.params.map(paramGroup => paramGroup.optimize());
    return this;
  }
  mustHaveCorrectNumArguments(fun, message, location) {
    if (this.params.length !== fun.params.length) {
      if (error(message, location)) {
        return 'error';
      }
    }
    return false;
  }
}

module.exports = FunctionCall;
