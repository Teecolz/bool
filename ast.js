/* eslint-env node */
/* eslint spaced-comment: "off" */

const ohm = require('ohm-js');
const fs = require('fs');

/**********************
* High-Level Classes
**********************/

class Program {
  constructor(block) {
    this.body = block;
  }
}

class Block {
  constructor(statements) {
    this.body = statements;
  }
}

/********************
* Statement Classes
*********************/

class Statement {}

class ClassDecl extends Statement {
  constructor(id, isa, fields, methods) {
    super();
    this.id = id;
    this.super = isa;
    this.fields = fields;
    this.methods = methods;
  }
}

class FunDecl extends Statement {
  constructor(id, params, block) {
    super();
    this.id = id;
    this.params = params;
    this.body = block;
  }
}

class ObjDecl extends Statement {
  constructor(id, properties) {
    super();
    this.id = id;
    this.properties = properties;
  }
}

// TODO: conditional
// TODO: vardecl
// TODO: loop

/**********************
* Expression Classes
**********************/

class Expression {}

class VariableExpression extends Expression {
  constructor(name) {
    super();
    this.name = name;
  }
}

class BinaryExpression extends Expression {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

class UnaryExpression extends Expression {
  constructor(op, operand) {
    super();
    this.op = op;
    this.operand = operand;
  }
}

class LiteralExpression extends Expression {
  constructor(val) {
    super();
    this.val = val;
  }
}

class BooleanLiteral extends LiteralExpression {}

class StringLiteral extends LiteralExpression {}

class NumericLiteral extends LiteralExpression {}

class ListLiteral extends LiteralExpression {}

class ObjectLiteral extends LiteralExpression {}
