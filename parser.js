/* eslint-env node */
/* eslint spaced-comment: "off" */

const ohm = require('ohm-js');
const fs = require('fs');
const Program = require('./entities/program.js');
const Block = require('./entities/block.js');
const BinaryExpression = require('./entities/binaryexpression.js');
const BooleanLiteral = require('./entities/booleanliteral.js');
const Case = require('./entities/case.js');
const ClassDeclaration = require('./entities/classdecl.js');
const ConditionalStmt = require('./entities/conditionalstatement.js');
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

const exports = module.exports || {};
const gram = ohm.grammar(fs.readFileSync('bool.ohm'));

const semantics = gram.createSemantics().addOperation('ast', {
  Program: b => new Program(b.ast()),
  Block: s => new Block(s.ast()),
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

});
