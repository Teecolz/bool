const BooleanLiteral = require('./booleanliteral.js');
const error = require('../error.js');
const FloatLiteral = require('./floatliteral.js');
const IntegerLiteral = require('./intliteral.js');
const UnaryExpression = require('./unaryexpression.js');
const StringLiteral = require('./stringliteral.js');
const Type = require('./type.js');
const VariableExpression = require('./varexp.js');

/* eslint eqeqeq: 1, no-bitwise: 1, no-restricted-properties: 1*/

const foldNumericalConstants = (op, x, y, NumberClass) => {
  switch (op) {
    case '+':
      return new NumberClass(x + y);
    case '-':
      return new NumberClass(x - y);
    case '*':
      return new NumberClass(x * y);
    case '/':
      if (NumberClass === IntegerLiteral) {
        return new NumberClass(Math.floor(x / y));
      }
      return new NumberClass(x / y);
    case '%':
      return new IntegerLiteral(x % y);
    case '<':
      return new BooleanLiteral(x < y);
    case '>':
      return new BooleanLiteral(x > y);
    case '>=':
      return new BooleanLiteral(x >= y);
    case '<=':
      return new BooleanLiteral(x <= y);
    case '==':
      return new BooleanLiteral(x == y); // eslint-disable-line eqeqeq
    case '!==':
      return new BooleanLiteral(x != y); // eslint-disable-line eqeqeq
    case '===':
      return new BooleanLiteral(x === y);
    case '!===':
      return new BooleanLiteral(x !== y);
    case '**':
      return new NumberClass(Math.pow(x, y)); // eslint-disable-line
    default:
      break;
    // TODO: need '//' operator
  }
  return null;
};

const getBoolFromBoolean = (boolean) => {
  if (boolean) {
    return 'tru';
  }
  return 'fal';
};

const getBooleanFromBool = (bool) => {
  if (bool === 'tru') {
    return true;
  }
  return false;
};

const foldBooleanConstants = (op, left, right) => {
  switch (op) {
    case '==':
      return new BooleanLiteral(getBoolFromBoolean(left == right));  // eslint-disable-line eqeqeq
    case '===':
      return new BooleanLiteral(getBoolFromBoolean(left === right));
    case '!=':
      return new BooleanLiteral(getBoolFromBoolean(left != right));  // eslint-disable-line eqeqeq
    case '!==':
      return new BooleanLiteral(getBoolFromBoolean(left !== right));
    case 'and':
      return new BooleanLiteral(getBooleanFromBool(left) && getBooleanFromBool(right));
    case 'or':
      return new BooleanLiteral(getBooleanFromBool(left) || getBooleanFromBool(right));
    default:
      break;
  }
  return null;
};

function foldStrings(op, left, right) {
  return op === '+' ? new StringLiteral(`\`${left + right}\``) : null;
}

function foldStringAndInt(op, left, right) {
  let outString = '';
  switch (op) {
    case '+':
      return new StringLiteral(`\`${left + right}\``);
    case '*':
      for (let i = 0; i < right; i += 1) {
        outString += left;
      }
      return new StringLiteral(`\`${outString}\``);
    default:
      break;
  }
  return null;
}

function foldStringAndBool(op, left, right) {
  return op === '+' ? new StringLiteral(`\`${left + right}\``) : null;
}

class BinaryExpression {
  constructor(left, op, right) {
    this.left = left;
    this.op = op;
    this.right = right;
  }

  analyze(context) {
    this.left.analyze(context);
    this.right.analyze(context);
    switch (this.op) {
      case '+':
        if (this.left.type.isString(true) || this.right.type.isString(true)) {
          this.type = Type.STRING;
        } else if (this.left.type.isArbitrary()) {
          if (this.right.type.isArbitrary()) {
            this.type = Type.ARBITRARY;
          } else if (!this.right.type.isString(true) && !this.right.type.isNumber(true) &&
            !this.right.type.isBool(true)) { // need to allow string concat with booleans
            const errorMessage = '+ requires compatible operands';
            error(errorMessage, this.right);
          }
        } else {
          this.mustHaveNumericalOperands();
          if (this.left.type.isInt() && this.right.type.isInt()) {
            this.type = Type.INT;
          } else {
            this.type = Type.FLOAT;
          }
        }
        break;
      case '-':
      case '*':
        if (this.left.type.isString()) {
          this.type = Type.STRING;
          const errorMessage = 'Cannot create a float multiple of a string';
          this.right.type.mustBeInteger(errorMessage, this.right);
        } else {
          this.mustHaveNumericalOperands();
          // how to handle operations that take int and float?
          if (this.left.type.isInt() && this.right.type.isInt()) {
            this.type = Type.INT;
          } else {
            this.type = Type.FLOAT;
          }
        }
        break;
      case '/':
      case '//':
      case '**':
        if (this.left.type.isArbitrary()) {
          if (this.right.type.isArbitrary()) {
            this.type = Type.ARBITRARY;
          } else {
            const errorMessage = '** requires numerical or variable args';
            this.right.type.mustBeNumber(errorMessage, this.right);
            this.type = Type.ARBITRARY;
          }
          break;
        }
        this.mustHaveNumericalOperands();
        // how to handle operations that take int and float?
        if (this.left.type.isInt() && this.right.type.isInt()) {
          this.type = Type.INT;
        } else {
          this.type = Type.FLOAT;
        }
        break;
      case '%':
        this.mustHaveIntegerOperands();
        this.type = Type.INT;
        break;
      case '>':
      case '>=':
      case '<':
      case '<=':
        if (this.left.type.isArbitrary()) {
          if (!this.right.type.isArbitrary()) {
            const errorMessage = `${this.op} requires numerical or variable args`;
            this.right.type.mustBeNumber(errorMessage, this.right);
          }
          this.type = Type.BOOL;
          break;
        }
        this.mustHaveNumericalOperands();
        this.type = Type.BOOL;
        break;
      case '==':
      case '===':
      case '!=':
      case '!==':
        this.mustHaveCompatibleOperands();
        this.type = Type.BOOL;
        break;
      case '[]':
        this.mustBeObject();
        if (this.left.referent.objectContext) { // object
          this.type = this.left.referent.objectContext.lookupProperty(this.right);
        } else { // list
          const errorMessage = 'Cannot access non-integer index of list';
          this.right.type.mustBeInteger(errorMessage, this.op);
          this.type = this.left.elementType; // what if out of index?
        }
        break;
      case 'and':
      case 'or':
        this.type = Type.BOOL;
        break;
      default:
        break;
    }
  }
  optimize() {
    this.left = this.left.optimize();
    this.right = this.right.optimize();
    if (this.operandsAreInstanceOf(IntegerLiteral)) {
      return foldNumericalConstants(this.op, +this.left.val, +this.right.val, IntegerLiteral);
    } else if ((this.left instanceof FloatLiteral || this.left instanceof IntegerLiteral) &&
      (this.right instanceof FloatLiteral || this.right instanceof IntegerLiteral)) {
      return foldNumericalConstants(this.op, +this.left.val, +this.right.val, FloatLiteral);
    } else if (this.operandsAreInstanceOf(BooleanLiteral)) {
      return foldBooleanConstants(this.op, this.left.val, this.right.val);
    } else if (this.left instanceof StringLiteral) {
      if (this.right instanceof StringLiteral || this.right instanceof FloatLiteral) {
        return foldStrings(this.op, this.left.val, this.right.val);
      } else if (this.right instanceof IntegerLiteral) {
        return foldStringAndInt(this.op, this.left.val, +this.right.val);
      } else if (this.right instanceof BooleanLiteral) {
        return foldStringAndBool(this.op, this.left.val, this.right.val);
      }
    }

    const isNumericLiteral = (operand, val) => {
      if (!(operand instanceof IntegerLiteral) && !(operand instanceof FloatLiteral)) {
        return false;
      }
      return +operand.val === val;
    };

    switch (this.op) {
      case '+':
        if (isNumericLiteral(this.left, 0)) {
          return this.right;
        }
        if (isNumericLiteral(this.right, 0)) {
          return this.left;
        }
        break;
      case '-':
        if (isNumericLiteral(this.right, 0)) {
          return this.left;
        }
        if (this.left instanceof VariableExpression && this.right instanceof VariableExpression) {
          if (this.left.referent === this.right.referent) {
            return new IntegerLiteral('0');
          }
        }
        break;
      case '*':
        if (isNumericLiteral(this.right, 0) || isNumericLiteral(this.left, 0)) {
          return new IntegerLiteral('0');
        }
        if (isNumericLiteral(this.right, 1)) {
          return this.left;
        }
        if (isNumericLiteral(this.left, 1)) {
          return this.right;
        }
        break;
      case '/':
        if (isNumericLiteral(this.right, 1)) {
          return this.left;
        }
        if (isNumericLiteral(this.left, 0)) {
          return this.left;
        }
        if (this.left instanceof VariableExpression && this.right instanceof VariableExpression) {
          if (this.left.referent === this.right.referent) {
            return new IntegerLiteral(1);
          }
        }
        break;
      default:
        break;
    }

    if (this.left.referent === this.right.referent) {
      if (this.op === '<' || this.op === '>' || this.op === '!==' || this.op === '!=') {
        return new BooleanLiteral('fal');
      }
      return new BooleanLiteral('tru');
    } else if ((this.op === 'and') && (this.left.val === 'fal' || this.right.val === 'fal')) {
      return new BooleanLiteral('fal');
    } else if ((this.op === 'or') && (this.left.val === 'tru' || this.right.val === 'tru')) {
      return new BooleanLiteral('tru');
    } else if (this.left.val === '0' && this.op === '-') {
      return new UnaryExpression('-', this.right);
    }
    return this;
  }

  operandsAreInstanceOf(instanceClass) {
    return this.left instanceof instanceClass && this.right instanceof instanceClass;
  }
  mustBeObject() {
    const errorMessage = `Operator '${this.op}' requires left operand to be object`;
    this.left.type.mustBeObject(errorMessage, this.op);
  }
  mustHaveNumericalOperands() {
    const errorMessage = `Operator '${this.op}' requires numerical operands`;
    this.left.type.mustBeCompatibleWith(Type.INT, errorMessage, this.op);
    this.right.type.mustBeCompatibleWith(Type.INT, errorMessage, this.op);
  }

  mustHaveIntegerOperands() {
    const errorMessage = `Operator '${this.op}' requires integer operands`;
    this.left.type.mustBeInteger(errorMessage, this.op);
    this.right.type.mustBeInteger(errorMessage, this.op);
  }

  mustHaveCompatibleOperands() {
    const errorMessage = `Operator '${this.op}' requires compatible operands`;
    this.left.type.mustBeCompatibleWith(this.right.type, errorMessage, this.op);
  }
  toString() {
    return `(BinExp ${this.left} ${this.op} ${this.right})`;
  }
}

module.exports = BinaryExpression;
