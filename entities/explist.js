class ExpList {
  constructor(exps) {
    this.exps = exps;
  }

  toString() {
    return `(ExpList ${this.exps})`;
  }
}

module.exports = ExpList;
