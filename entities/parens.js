class Parens {
  constructor(exp) {
    this.exp = exp;
  }

  toString() {
    return `(Parens ${this.exp})`;
  }
}

module.exports = Parens;
