const ClassInstantiation = require('./classinstantiation.js');
const Type = require('./type.js');
const FunctionCall = require('./funcall.js');

class ObjectAccess {
  constructor(container, prop) {
    this.container = container;
    this.prop = prop;
  }
  analyze(context) {
    this.container.analyze(context);
    if (this.container.referent.value instanceof ClassInstantiation) {
      if (this.prop instanceof FunctionCall) {
        this.prop.analyze(this.container.referent.value.classContext);
        this.type = this.prop.type;
      } else {
        this.type = Type.ARBITRARY;
      }
    } else {
      this.type = Type.ARBITRARY;
    }
  }
  toString() {
    return `(Access ${this.container} . ${this.prop})`;
  }
}

module.exports = ObjectAccess;
