const error = require('../error.js');
const Type = require('./type.js');
const Undefined = require('./undefined.js');

class FunctionCall {
  constructor(id, params) {
    this.id = id;
    this.params = params;
  }

  toString() {
    return `(FunCall ${this.id} ${this.params.join(', ').replace(/, $/, '')})`;
  }

  // Still need to analyze chained calls... this is going to be an issue
  analyze(context) {
    let curFun = context.lookupVariable(this.id); // ensure function defined within this scope
    let paramGroup;
    let errorMessage;
    let isPhantomFunction; // avoid trying to access properties of fake function
    let paramLength;

    for (let i = 0; i < this.params.length; i += 1) {
      isPhantomFunction = false;

      if (i > 0) {
        // Cannot call non function
        if (!this.type.isFunction()) {
          errorMessage = 'Cannot call non-function as function';
          this.type.mustBeFunction(errorMessage, this.id);
          this.type = Type.FUNCTION; // make type compatible
          isPhantomFunction = true;
        }
      }

      paramGroup = this.params[i];
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
            `Incompatible types: Expected ${curFun.params[j].type}, saw ${this.params[j].type}`;

          this.params[j].type.mustBeCompatibleWith(
            curFun.params[j].type,
            errorMessage,
            this.params[j]);
        }

        this.type = curFun.returnType;
        this.val = curFun.returnValue;
      } else {
        // Keep compatible types
        this.type = Type.ARBITRARY;
        this.val = new Undefined();
      }

      // Chain function calls if necessary
      if (this.type.name === 'function') {
        curFun = this.val;
      }
    }
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
