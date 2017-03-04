class ListExpression {
  constructor(exp, id, lst, cond) {
    this.exp = exp;
    this.id = id;
    this.lst = lst;
    this.cond = cond;
  }

  toString() {
    return `${this.exp} for ${this.id} in ${this.lst} ${this.cond}`.replace(/ $/, '');
  }
}

module.exports = ListExpression;
