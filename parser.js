/* eslint-env node */
/* eslint spaced-comment: "off" */

const ohm = require('ohm-js');
const fs = require('fs');
const error = require('./error');
const Program = require('./entities/program.js');
const Block = require('./entities/block.js');
const BinaryExpression = require('./entities/binaryexpression.js');
const BooleanLiteral = require('./entities/booleanliteral.js');
const Case = require('./entities/case.js');
const ClassDeclaration = require('./entities/classdecl.js');
const ConditionalStatement = require('./entities/conditionalstatement.js');
const ForStatement = require('./entities/forstatement.js');
const FunctionDeclaration = require('./entities/fundecl.js');
const ListLiteral = require('./entities/listliteral.js');
const NumericLiteral = require('./entities/numericliteral.js');
const ObjectDeclaration = require('./entities/objdecl.js');
const ObjectLiteral = require('./entities/objectliteral.js');
const ReturnStatement = require('./entities/returnstatement.js');
const StringLiteral = require('./entities/stringliteral.js');
const UnaryExpression = require('./entities/unaryexpression.js');
const WhileStatement = require('./entities/whilestatement.js');
const FieldDeclaration = require('./entities/fielddecl.js');
const MethodDeclaration = require('./entities/methoddecl.js');
const Suite = require('./entities/suite.js');
const IntegerLiteral = require('./entities/intliteral.js');
const FloatLiteral = require('./entities/floatliteral.js');
const RangeExpression = require('./entities/rangeexpression.js');
const RangeLiteral = require('./entities/rangeliteral.js');
const FunctionCall = require('./entities/funcall.js');
const ClassInstantiation = require('./entities/classinstantiation.js');

const exports = module.exports || {};
const grammar = ohm.grammar(fs.readFileSync('bool.ohm'));

const semantics = grammar.createSemantics().addOperation('ast', {
  Program: b => new Program(b.ast()),
  Block: s => new Block(s.ast()),
  Suite: s => new Suite(s.ast()),
  Stmt_classdecl: (id, isa, _, fields, methods) =>
    new ClassDeclaration(
      id.sourceString,
      isa.sourceString,
      fields.ast(),
      methods.ast()),
  fielddecl: (_, id) => new FieldDeclaration(id.sourceString),
  MethodDecl: (id, params, _, b) =>
    new MethodDeclaration(id.sourceString, params.sourceString, b.ast()),
  Stmt_fundecl: (id, params, _, b) =>
    new FunctionDeclaration(id.sourceString, params.sourceString, b.ast()),
  Stmt_conditional: (cases, b) =>
    new ConditionalStatement(cases.ast(), b.ast()),
  Case: (exp, b) => new Case(exp.ast(), b.ast()),
  stringlit: s => new StringLiteral(s.sourceString),
  boollit: b => new BooleanLiteral(b.sourceString),
  intlit: i => new IntegerLiteral(i.sourceString),
  floatlit: f => new FloatLiteral(f.sourceString),
  Listlit: el => new ListLiteral(el.ast()),
  Range: (_, r) => new RangeLiteral(r.sourceString),
  ClassInst: (_, f) => new ClassInstantiation(f.ast()),
  Funcall: (id, params) => new FunctionCall(id.sourceString, params.sourceString),
  Exp: (e1, _, e2) => new BinaryExpression(e1.ast(), 'or', e2.ast()),
  Exp1: (e1, _, e2) => new BinaryExpression(e1.ast(), 'and', e2.ast()),
  Exp2_binexp: (e1, op, e2) => new BinaryExpression(e1.ast(), op.sourceString, e2.ast()),
  Exp3_binexp: (e1, op, e2) => new BinaryExpression(e1.ast(), op.sourceString, e2.ast()),
  Exp4_binexp: (e1, op, e2) => new BinaryExpression(e1.ast(), op.sourceString, e2.ast()),
  exp7_listAccess: (e1, e2) => new BinaryExpression(e1.ast(), '[]', e2.ast()),
  exp7_access: (e1, _, e2) => new BinaryExpression(e1.ast(), '.', e2.ast()),
  ListAccessor: (_, e) => e.ast(),
});

exports.parse = (text) => {
  const match = grammar.match(text);
  if (match.succeeded()) {
    semantics(match).ast();
  } else {
    error(match.message);
  }
};
