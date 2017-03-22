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
    }
    return this.name === otherType.name;
  }
  mustBeInteger(message, location) {
    if (this.name !== 'int') {
      error(message, location);
    }
  }
  toString() {
    return `${this.name}`;
  }
}

module.exports = Type;
