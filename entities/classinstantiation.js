const Type = require('./type.js');

class ClassInstantiation {
  constructor(id, params) {
    this.id = id;
    this.params = params;
  }

  analyze(context) {
    this.id.analyze(context);
    this.params.analyze(context);
    this.type = Type.Construct(`${this.id}`);
    this.classContext = context.lookupVariable(this.id.id).classContext;
    context.addVariable(`${this.id}`, this);
  }
  optimize() {
    this.params = this.params.optimize();
    return this;
  }
  toString() {
    return `(New ${this.id} ${this.params})`;
  }
}

module.exports = ClassInstantiation;
