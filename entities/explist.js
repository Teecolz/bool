class ExpList {
  constructor(exps) {
    this.exps = exps;
  }

  toString() {
    return `${this.exps.join(', ')}`;
  }
}

module.exports = ExpList;
