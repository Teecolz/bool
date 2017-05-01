const ClassInstantiation = require('./classinstantiation.js');
const ObjectDeclaration = require('./objdecl.js');
const ObjectLiteral = require('./objectliteral.js');
const PropertyDeclaration = require('./propertydeclaration.js');
const Type = require('./type.js');

class BracketAcess {
  constructor(container, exps) {
    this.container = container;
    this.exps = exps;
  }
  analyze(context) {
    this.container.analyze(context);
    let errorMessage = 'Cannot access properties of non-object';
    this.container.type.mustBeOneOf(['<list>', 'object'], errorMessage, this.container);
    let currentContext = context;
    if (this.container.type.isObject()) {
      if (this.container.type.isArbitrary()) {
        this.type = Type.ARBITRARY;
      } else if (this.container.referent instanceof ClassInstantiation) {
        currentContext = this.container.referent.classContext;
        this.exps.some((exp, index) => {
          exp.analyze(currentContext);
          if (exp instanceof ObjectLiteral || exp instanceof ObjectDeclaration ||
              exp instanceof PropertyDeclaration) {
            currentContext = exp.objectContext;
          } else if (exp instanceof ClassInstantiation) {
            currentContext = exp.classContext;
          } else if (exp.type.isList()) {
            this.type = Type.ARBITRARY; // may need error here
            return true;
          } else if (exp.type.isString(true) || exp.type.isNumber(true)) {
            this.type = Type.ARBITRARY;
            return true;
          }
          return index === this.exps.length;
        });
      }
    } else if (this.container.type.isList()) {
      errorMessage = 'Cannot access non-integer index of list';
      this.exps.some((exp, index) => {
        exp.analyze(context);
        if (!exp.type.isInteger()) {
          exp.type.mustBeInteger(errorMessage, exp);
          this.type = Type.ARBITRARY;
          return true;
        }
        this.type = exp.type;
        return index === this.exps.length;
      });
    }
  }
  toString() {
    return `(${this.container} [] ${this.exps})`;
  }
}


module.exports = BracketAcess;
