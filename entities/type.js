const error = require('../error.js');

class Type {
  constructor(type) {
    this.name = type;
  }
  // need to handle arbitrary types
  mustBeCompatibleWith(otherType, message, location) {
    if (!this.isCompatibleWith(otherType)) {
      error(message, location);
    }
  }
  isCompatibleWith(otherType) {
    if (this.name === 'int' || this.name === 'float') {
      return (otherType.name === 'int' || otherType.name === 'float');
    } else if (this.name === '<arbitrary_type>') {
      return true;
    }
    return this.name === otherType.name;
  }
  mustBeInteger(message, location) {
    if (this.name !== 'int') {
      error(message, location);
    }
  }
  isInt() {
    return this.name === 'int';
  }
  mustBeBoolean(message, location) {
    if (this.name !== 'bool') {
      error(message, location);
    }
  }
  mustBeArbitrary(message, location) {
    if (this.name !== '<arbitrary_type>') {
      error(message, location);
    }
  }
  toString() {
    return `${this.name}`;
  }
}

module.exports = {
  BOOL: new Type('bool'),
  INT: new Type('int'),
  FLOAT: new Type('float'),
  STRING: new Type('string'),
  ARBITRARY: new Type('<arbitrary_type>'),
  Construct(forName) { return new Type(forName); },
};
