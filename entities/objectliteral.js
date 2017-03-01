class ObjectLiteral {
  constructor(props) {
    this.props = props;
  }

  toString() {
    return `(Objlit {${this.props.join(', ')}})`;
  }
}

module.exports = ObjectLiteral;
