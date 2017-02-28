class ObjectDeclaration {
  constructor(id, properties) {
    this.id = id;
    this.properties = properties;
  }

  toString() {
    return `(ObjDecl ${this.id} ${this.properties})`;
  }
}

module.exports = ObjectDeclaration;
