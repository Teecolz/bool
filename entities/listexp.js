class ListExpression {
  constructor(exp, id, lst) {
    this.exp = exp;
    this.id = id;
    this.lst = lst;
  }

  toString() {
    return `${this.exp} for ${this.id} in ${this.lst}`;
  }
}

module.exports = ListExpression;
