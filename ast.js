const ohm = require('ohm.js');
const fs = require('fs');

class Program {
  constructor(block) {
    this.body = block;
  }
}

class Expression {}

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

class Block {
  constructor(statements) {
    this.body = statements;
  }
}

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
