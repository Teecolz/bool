class PropertyDeclaration {
  constructor(key, val) {
    this.key = key;
    this.val = val;
  }

  toString() {
    return `(PropDecl ${this.key} : ${this.val})`;
  }
}

module.exports = PropertyDeclaration;
