/* eslint-env node */
/* eslint spaced-comment: "off" */

const ohm = require('ohm-js');
const fs = require('fs');

/**********************
* High-Level Classes
**********************/

class Program {
  constructor(block) {
    this.block = block;
  }

  toString() {
    return `(Program ${this.block})`;
  }
}

class Block {
  constructor(statements) {
    this.body = statements;
  }

  toString() {
    return `(Block ${this.body})`;
  }
}

/********************
* Statement Classes
*********************/

class Statement {}

class ClassDeclaration extends Statement {
  constructor(id, isa, fields, methods) {
    super();
    this.id = id;
    this.isa = isa;
    this.fields = fields;
    this.methods = methods;
  }

  toString() {
    return `(ClassDecl ${this.id} ${this.isa} ${this.fields} ${this.methods})`;
  }
}

class FunDecl extends Statement {
  constructor(id, params, block) {
    super();
    this.id = id;
    this.params = params;
    this.body = block;
  }

  toString() {
    return `(Function ${this.id} ${this.params} ${this.body})`;
  }
}

class ObjDecl extends Statement {
  constructor(id, properties) {
    super();
    this.id = id;
    this.properties = properties;
  }

  toString() {
    return `(ObjDecl ${this.id} ${this.properties})`;
  }
}

class ReturnStatement extends Statement {
  constructor(expression) {
    super();
    this.returnValue = expression;
  }

  toString() {
    return `(Return ${this.returnValue})`;
  }
}

class IfStatement extends Statement {
  constructor(expression, block, branches) {
    super();
    this.condition = expression;
    this.body = block;
    this.branches = branches;
  }

  toString() {
    return `(If ${this.condition} ${this.body} ${this.branches})`;
  }
}

class ElIfStatement extends Statement {
  constructor(expression, block) {
    super();
    this.condition = expression;
    this.body = block;
  }
}

class ElStatement extends Statement {
  constructor(block) {
    super();
    this.body = block;
  }
}

class ForStatement extends Statement {
  constructor(id, list, block) {
    super();
    this.iterator = id;
    this.list = list;
    this.block = block;
  }
}

class WhileStatement extends Statement {
  constructor(condition, block) {
    super();
    this.condition = condition;
    this.body = block;
  }
}

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

class FunCall extends Expression {
  constructor(id, params) {
    super();
    this.id = id;
    this.params = params;
  }

  toString() {
    return `(FunCall ${this.id} ${this.params})`;
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
