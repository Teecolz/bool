class ObjectLiteral {
  constructor(props) {
    this.props = props;
  }
  analyze(context) {
    this.objectContext = context.createChildContext();
    for (let i = 0; i < this.props.length; i += 1) {
      this.props[i].analyze(this.objectContext);
    }
  }
  toString() {
    return `(Objlit {${this.props.join(', ')}})`;
  }
}

module.exports = ObjectLiteral;
