const ClassInstantiation = require('./classinstantiation.js');
const Type = require('./type.js');
const FunctionCall = require('./funcall.js');
const ObjectDeclaration = require('./objdecl.js');
const ObjectLiteral = require('./objectliteral.js');
const PropertyDeclaration = require('./propertydeclaration.js');
const Undefined = require('./undefined.js');

class ObjectAccess {
  constructor(container, prop) {
    this.container = container;
    this.prop = prop;
  }
  analyze(context) {
    const errormessage = 'Cannot access property of non-object';
    this.container.analyze(context);
    this.container.type.mustBeObject(errormessage, this.container);
    if (this.container.type.isArbitrary()) {
      this.type = Type.ARBITRARY;
    } else if (this.container.referent instanceof ClassInstantiation) {
      this.prop.analyze(this.container.referent.classContext);
      this.type = this.prop.type;
    } else if (this.container.referent instanceof FunctionCall) {
      if (!(this.container.referent.val instanceof Undefined)) {
        if (this.container.referent.val instanceof ObjectLiteral ||
              this.container.referent.val instanceof ObjectDeclaration) {
          this.prop.analyze(this.container.referent.val.objectContext);
          this.type = this.prop.type;
        } else if (this.container.referent.val instanceof ClassInstantiation) {
          this.prop.analyze(this.container.referent.val.classContext);
          this.type = this.prop.type;
        } else {
          this.type = Type.ARBITRARY;
        }
      } else {
        this.type = Type.ARBITRARY;
      }
    } else if (this.container.referent instanceof ObjectDeclaration ||
               this.container.referent instanceof ObjectLiteral) {
      this.prop.analyze(this.container.referent.objectContext);
      this.type = this.prop.type;
    } else if (this.container.referent instanceof PropertyDeclaration) {
      this.prop.analyze(this.container.referent.val.objectContext);
      this.type = this.prop.type;
    } else {
      this.type = Type.ARBITRARY;
    }
  }
  toString() {
    return `(Access ${this.container} . ${this.prop})`;
  }
}

module.exports = ObjectAccess;
