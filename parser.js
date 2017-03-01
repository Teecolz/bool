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
const ClassSuite = require('./entities/classsuite.js');
const ClassBody = require('./entities/classbody.js');
const FunctionLiteral = require('./entities/functionliteral.js');
const IdLiteral = require('./entities/idliteral.js');
const ExpList = require('./entities/explist.js');
const Parameters = require('./entities/params.js');
const PropertyDeclaration = require('./entities/propertydeclaration.js');

const grammar = ohm.grammar(fs.readFileSync('bool.ohm'));

/* eslint no-unused-vars: 1 */
const semantics = grammar.createSemantics().addOperation('ast', {
  Program: b => new Program(b.ast()),
  Block: (s, _) => new Block(s.ast()),
  Suite: (_, indent, s, nl, ded) => new Suite(s.ast()),
  params: (_, id1, sp, ids, close) => new Parameters([id1.ast()].concat(ids.ast())),
  ClassDecl: (cl, id, isa, superId, col, cs) =>
    new ClassDeclaration(
      id.sourceString,
      superId.sourceString,
      cs.ast()),
  ClassSuite: (_, ind, cb, ded) => new ClassSuite(cb.ast()),
  ClassBody: (fields, nl, methods) => new ClassBody(fields.ast(), methods.ast()),
  fielddecl: (_, id) => new FieldDeclaration(id.sourceString),
  MethodDecl: (id, params, _, s) =>
    new MethodDeclaration(id.sourceString, params.ast(), s.ast()),
  methodparams: (_, id1, sp, ids, close) => new Parameters([id1.ast()].concat(ids.ast())),
  ObjDecl: (id, _, nl, ind, props, nl2, ded) =>
    new ObjectDeclaration(id.sourceString, props.ast()),
  PropertyDecl: (id, _, e) => new PropertyDeclaration(id.sourceString, e.ast()),
  FunDecl: (f, id, params, _, s) =>
    new FunctionDeclaration(id.sourceString, params.ast(), s.ast()),
  Conditional: (i, c, elifs, cases, el, col, b) =>
    new ConditionalStatement([c.ast()].concat(cases.ast()), b.ast()),
  Case: (e, _, s) => new Case(e.ast(), s.ast()),
  Explist: (e1, _, rest) => new ExpList([e1.ast()].concat(rest.ast())),
  stringlit: (_, s, close) => new StringLiteral(s.sourceString),
  boollit: b => new BooleanLiteral(b.sourceString),
  id: i => new IdLiteral(i.sourceString),
  intlit: i => new IntegerLiteral(i.sourceString),
  floatlit: (iPart, _, fracPart) =>
    new FloatLiteral(`${iPart.sourceString} . ${fracPart.sourceString}`),
  Listlit: (_, el, end) => new ListLiteral(el.ast()),
  Objlit_singleprop: (_, prop, close) => new ObjectLiteral(prop.ast()),
  Objlit_multiprop: (_, nl, ind, props, nl2, ded, close) =>
    new ObjectLiteral(props.ast()),
  Funlit: (params, _, s) => new FunctionLiteral(params.ast(), s.ast()),
  Range: (_, r, close) => new RangeLiteral(r.sourceString),
  ClassInst: (_, fc) => new ClassInstantiation(fc.ast()),
  Funcall: (id, params) => new FunctionCall(id.sourceString, params.ast()),
  Exp_binexp: (e1, _, e2) => new BinaryExpression(e1.ast(), 'or', e2.ast()),
  Exp1_binexp: (e1, _, e2) => new BinaryExpression(e1.ast(), 'and', e2.ast()),
  Exp2_binexp: (e1, op, e2) => new BinaryExpression(e1.ast(), op.sourceString, e2.ast()),
  Exp3_binexp: (e1, op, e2) => new BinaryExpression(e1.ast(), op.sourceString, e2.ast()),
  Exp4_binexp: (e1, op, e2) => new BinaryExpression(e1.ast(), op.sourceString, e2.ast()),
  Exp5_expExp: (e1, op, e2) => new BinaryExpression(e1.ast(), op, e2.ast()),
  Exp6_prefixOp: (op, exp) => new UnaryExpression(exp.ast(), op),
  Exp7_listAccess: (e1, _, e2, close) => new BinaryExpression(e1.ast(), '[]', e2.ast()),
  Exp7_access: (e1, _, e2) => new BinaryExpression(e1.ast(), '.', e2.ast()),
  Loop_forIn: (_, id, n, l, colon, s) => new ForStatement(id.sourceString, l.ast(), s.ast()),
  Loop_while: (_, exp, colon, s) => new WhileStatement(exp.ast(), s.ast()),
  Return: (_, exp) => new ReturnStatement(exp),
});

module.exports = (text) => {
  const match = grammar.match(text);
  if (match.succeeded()) {
    return semantics(match).ast();
  }
  error(match.message);
  return undefined;
};
