const Type = require('./type.js');

class ObjectLiteral {
  constructor(props) {
    this.props = props;
  }
  analyze(context) {
    this.objectContext = context.createChildContext();
    this.props.forEach(p => p.analyze(this.objectContext));
    this.type = Type.OBJECT;
  }
  toString() {
    return `(Objlit {${this.props.join(', ')}})`;
  }
}

module.exports = ObjectLiteral;
