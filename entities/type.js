const error = require('../error.js');

class Type {
  constructor(type, parent) {
    this.name = type;
    this.parent = parent;
  }
  getElementType() {
    const str = this.name.substring(1, this.name.length - 1);
    return new Type(str);
  }
  // need to handle arbitrary types
  mustBeCompatibleWith(otherType, message, location) {
    if (!this.isCompatibleWith(otherType)) {
      error(message, location);
    }
  }
  isCompatibleWith(otherType) {
    if (this.name === '<arbitrary_type>' || otherType.name === '<arbitrary_type>') {
      return true;
    } else if (this.name === 'int' || this.name === 'float') {
      return (otherType.name === 'int' || otherType.name === 'float');
    }

    return this.name === otherType.name;
  }
  mustBeInteger(message, location) {
    if (this.name !== 'int' && this.name !== '<arbitrary_type>') {
      error(message, location);
    }
  }
  mustBeOneOf(typeList, message, location) {
    let isOneOf = false;
    typeList.forEach((t) => {
      if (t === '<list>') {
        isOneOf = this.isList();
      }
      if (this.name === t) {
        isOneOf = true;
      }
    });
    if (!isOneOf) {
      error(message, location);
    }
  }
  isArbitrary() {
    return this.name === '<arbitrary_type>';
  }
  isBool(forceBool) {
    if (forceBool) {
      return this.name === 'bool';
    }
    return this.name === 'bool' || this.isArbitrary();
  }
  isFloat() {
    return this.name === 'float' || this.isArbitrary();
  }
  isInt(forceInt) {
    if (forceInt) {
      return this.name === 'int';
    }
    return this.name === 'int' || this.isArbitrary();
  }
  isFunction() {
    return this.name === '<function>' || this.isArbitrary();
  }
  isList() {
    return this.name.match(/\[.*\]/);
  }
  isNumber(forceNumber) {
    if (forceNumber) {
      return this.name === 'float' || this.name === 'int';
    }
    return this.name === 'float' || this.name === 'int' || this.isArbitrary();
  }
  isObject() {
    return this.name === 'object' || this.isArbitrary();
  }
  isString(forceString) {
    if (forceString) {
      return this.name === 'string';
    }
    return this.name === 'string' || this.isArbitrary();
  }
  mustBeFunction(message, location) {
    if (!this.isFunction()) {
      error(message, location);
    }
  }
  mustBeBoolean(message, location) {
    if (this.name !== 'bool') {
      error(message, location);
    }
  }
  mustBeList(message, location) {
    if (!this.isArbitrary() && !this.isList()) {
      error(message, location);
    }
  }
  mustBeNumber(message, location) {
    if (this.name !== 'float' && this.name !== 'int') {
      error(message, location);
    }
  }
  mustBeArbitrary(message, location) {
    if (!this.isArbitrary()) {
      error(message, location);
    }
  }
  mustBeObject(message, location) {
    if (this.name === 'int' || this.name === 'float' || this.name === '<function>' || this.name === 'bool') {
      error(message, location);
    }
  }
  optimize() {
    return this;
  }
  toString() {
    return `${this.name}`;
  }
}

const NUMBER = new Type('number');

module.exports = {
  BOOL: new Type('bool'),
  INT: new Type('int', NUMBER),
  FLOAT: new Type('float', NUMBER),
  STRING: new Type('string'),
  ARBITRARY: new Type('<arbitrary_type>'),
  FUNCTION: new Type('<function>'),
  OBJECT: new Type('object'),
  UNDEFINED: new Type('<>'),
  Construct(forName, parent) { return new Type(forName, parent); },
};
