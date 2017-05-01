const ClassInstantiation = require('./classinstantiation.js');
const Type = require('./type.js');
const FunctionCall = require('./funcall.js');
const IdLiteral = require('./idliteral.js');
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
    } else if (this.container.referent &&
               this.container.referent.value instanceof ClassInstantiation) {
      this.getValAndType(this.container.referent.value.classContext);
    } else if (this.container.referent instanceof FunctionCall) {
      if (!(this.container.referent.value instanceof Undefined)) {
        if (this.container.referent.value instanceof ObjectLiteral ||
              this.container.referent.value instanceof ObjectDeclaration) {
          this.getValAndType(this.container.referent.value.objectContext, true);
        } else if (this.container.referent.value instanceof ClassInstantiation) {
          this.getValAndType(this.container.referent.value.classContext);
        } else {
          this.type = Type.ARBITRARY;
        }
      } else {
        this.type = Type.ARBITRARY;
      }
    } else if (this.container.referent instanceof ObjectDeclaration ||
               this.container.referent instanceof ObjectLiteral) {
      this.getValAndType(this.container.referent.objectContext, true);
    } else if (this.container.referent instanceof PropertyDeclaration) {
      this.getValAndType(this.container.referent.val.objectContext, true);
    } else if (this.container instanceof ObjectAccess) {
      if (this.container.val) {
        if (this.container.val instanceof PropertyDeclaration) {
          this.getValAndType(this.container.val.val.objectContext, true);
        } else if (this.container.val instanceof ObjectDeclaration ||
                   this.container.val instanceof ObjectLiteral) {
          this.getValAndType(this.container.val.val.objectContext, true);
        }
      } else {
        this.type = Type.ARBITRARY;
      }
    } else {
      this.type = Type.ARBITRARY;
    }
  }
  getValAndType(context, isObjectContext) {
    if (this.prop instanceof IdLiteral) {
      this.val = context.lookupVariable(`${this.prop}`);
      if (isObjectContext) {
        this.isObjectContext = true;
      }
      if (!this.val) {
        this.type = Type.ARBITRARY;
      } else {
        this.type = this.val.type;
      }
    } else {
      this.prop.analyze(context);
      this.type = this.prop.type;
    }
  }
  toString() {
    return `(Access ${this.container} . ${this.prop})`;
  }
}

module.exports = ObjectAccess;
