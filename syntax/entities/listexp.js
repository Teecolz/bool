const Type = require('./type.js');

class ListExpression {
  constructor(exp, iterator, lst, cond) {
    this.exp = exp;
    this.iterator = iterator;
    this.lst = lst;
    this.cond = cond;
  }
  analyze(context) {
    const localContext = context.createChildContext();
    this.lst.analyze(localContext);
    const errorMessage = 'Cannot use for-in on non list.';
    this.lst.type.mustBeList(errorMessage, this.lst);
    this.iterator.type = this.lst.type.getElementType();
    localContext.addVariable(this.iterator.id, this.iterator);

    if (this.cond.length > 0) { // only analyze condition if one exists
      this.cond[0].analyze(localContext);
    }

    this.exp.analyze(localContext);
    this.type = Type.Construct(`[${this.exp.type}]`);
  }
  optimize() {
    this.exp = this.exp.optimize();
    this.lst = this.lst.optimize();
    this.cond = this.cond.optimize();
    return this;
  }
  toString() {
    return `${this.exp} for ${this.iterator} in ${this.lst} ${this.cond}`.replace(/ $/, '');
  }
}

module.exports = ListExpression;
