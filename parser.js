/* eslint-env node */
/* eslint spaced-comment: "off" */

/************************
* DO NOT USE FAT ARROWS *
************************/

const ohm = require('ohm-js');
const fs = require('fs');
const error = require('./error');
const Program = require('./entities/program.js');
const Block = require('./entities/block.js');
const Assignment = require('./entities/assign.js');
const BinaryExpression = require('./entities/binaryexpression.js');
const BooleanLiteral = require('./entities/booleanliteral.js');
const Case = require('./entities/case.js');
const ClassDeclaration = require('./entities/classdecl.js');
const ConditionalStatement = require('./entities/conditionalstatement.js');
const ForStatement = require('./entities/forstatement.js');
const FunctionDeclaration = require('./entities/fundecl.js');
const ListLiteral = require('./entities/listliteral.js');
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
const FunctionCall = require('./entities/funcall.js');
const ClassInstantiation = require('./entities/classinstantiation.js');
const ClassSuite = require('./entities/classsuite.js');
const ClassBody = require('./entities/classbody.js');
const FunctionLiteral = require('./entities/functionliteral.js');
const IdLiteral = require('./entities/idliteral.js');
const ExpList = require('./entities/explist.js');
const ListExpression = require('./entities/listexp.js');
const Parameters = require('./entities/params.js');
const PropertyDeclaration = require('./entities/propertydeclaration.js');
const VariableDeclaration = require('./entities/variabledeclaration.js');
const VariableAssignment = require('./entities/varassignment.js');
const VariableExpression = require('./entities/varexp.js');
const Parens = require('./entities/parens.js');
const DoUntilStatement = require('./entities/dountil.js');
const SimpleIf = require('./entities/simpleif.js');
const FullStatement = require('./entities/fullstmt.js');
const Statement = require('./entities/stmt.js');
const Type = require('./entities/type.js');

const grammar = ohm.grammar(fs.readFileSync('bool.ohm'));

/* eslint no-unused-vars: 1 */
const semantics = grammar.createSemantics().addOperation('ast', {
  Program(b) { return new Program(b.ast()); },
  Block(s) { return new Block(s.ast()); },
  FullStmt(s, _) { return new FullStatement(s.ast()); },
  Stmt(s) { return new Statement(s.ast()); },
  Suite(nl, indent, s, nl2, _) {
    return new Suite(s.ast());
  },
  SimpleSuite(_, ind, exp, nl, ded) {
    return exp.ast();
  },
  params(p0, id1, p1, ids, _) {
    return new Parameters([id1.ast()].concat(ids.ast()));
  },
  Funparams(_, p1, rest, close) {
    return new Parameters([p1.ast()].concat(rest.ast()));
  },
  ClassDecl(cl, id, isa, superId, col, cs) {
    return new ClassDeclaration(id.sourceString, superId.sourceString, cs.ast());
  },
  ClassSuite(nl, ind, cb, ded) {
    return new ClassSuite(cb.ast());
  },
  ClassBody(fields, nl, methods) {
    return new ClassBody(fields.ast(), methods.ast());
  },
  VarDecl(l, id, type, _, exp) {
    return new VariableDeclaration(id.ast(), type.ast(), exp.ast());
  },
  OpAssign(id, op, e) {
    return new VariableAssignment(
      id.ast(),
      new BinaryExpression(
        id.ast(),
        op.sourceString.charAt(0),
        e.ast()));
  },
  Type_single(_, t) {
    return Type.Construct(t.sourceString);
  },
  Type_list(_, open, type, close) {
    return `(Type List(${type.sourceString}))`;
  },
  VarAssignment(vexp, _, val) {
    return new VariableAssignment(vexp.ast(), val.ast());
  },
  VarExp(name) {
    return new VariableExpression(name.sourceString);
  },
  fielddecl(open, id) {
    return new FieldDeclaration(id.sourceString);
  },
  MethodDecl(id, params, col, s) {
    return new MethodDeclaration(id.sourceString, params.ast(), s.ast());
  },
  methodparams(open, id1, sp, ids, close) {
    return new Parameters([id1.ast()].concat(ids.ast()));
  },
  ObjDecl(id, col, nl, ind, props, nl2, ded) {
    return new ObjectDeclaration(id.sourceString, props.ast());
  },
  PropertyDecl(id, col, e) {
    return new PropertyDeclaration(id.sourceString, e.ast());
  },
  FunDecl(f, id, params, col, s) {
    return new FunctionDeclaration(id.sourceString, params.ast(), s.ast());
  },
  Conditional(i, c, elifs, cases, el, col, b) {
    return new ConditionalStatement([c.ast()].concat(cases.ast()), b.ast());
  },
  Case(e, col, s) { return new Case(e.ast(), s.ast()); },
  Explist(e1, _, el) {
    return new ExpList([e1.ast()].concat(el.ast()));
  },
  ListExp(e, _, id, n, list, cond) {
    return new ListExpression(e.ast(), id.ast(), list.ast(), cond.ast());
  },
  SimpleIf(_, e) {
    return new SimpleIf(e.ast());
  },
  stringlit(_, s, end) {
    return new StringLiteral(this.sourceString);
  },
  Listlit(st, exps, end) {
    return new ListLiteral(exps.ast());
  },
  Objlit_singleprop(_, prop, close) {
    return new ObjectLiteral(prop.ast());
  },
  Objlit_multiprop(_, nl, ind, props, nl2, ded, close) {
    return new ObjectLiteral(props.ast());
  },
  Funlit(params, _, s) {
    return new FunctionLiteral(params.ast(), s.ast());
  },
  Range(_, exp, close) {
    return exp.ast();
  },
  RangeExp(st, _, end, com, neg, step) {
    return new RangeExpression(st.ast(), end.ast(), step.ast());
  },
  ClassInst(_, id, params) {
    return new ClassInstantiation(id.sourceString, params.ast());
  },
  Funcall(id, params) {
    return new FunctionCall(id.sourceString, params.ast());
  },
  Exp_binexp(e1, _, e2) {
    return new BinaryExpression(e1.ast(), 'or', e2.ast());
  },
  Exp1_binexp(e1, _, e2) {
    return new BinaryExpression(e1.ast(), 'and', e2.ast());
  },
  Exp2_binexp(e1, op, e2) {
    return new BinaryExpression(e1.ast(), op.sourceString, e2.ast());
  },
  Exp3_binexp(e1, op, e2) {
    return new BinaryExpression(e1.ast(), op.sourceString, e2.ast());
  },
  Exp4_binexp(e1, op, e2) {
    return new BinaryExpression(e1.ast(), op.sourceString, e2.ast());
  },
  Exp5_expExp(e1, op, e2) {
    return new BinaryExpression(e1.ast(), op.sourceString, e2.ast());
  },
  Exp6_prefixOp(op, exp) {
    return new UnaryExpression(op.sourceString, exp.ast());
  },
  Exp7_listAccess(e1, _, e2, close) {
    return new BinaryExpression(e1.ast(), '[]', e2.ast());
  },
  Exp7_access(e1, _, e2) {
    return new BinaryExpression(e1.ast(), '.', e2.ast());
  },
  Exp8_parens(_, e, close) {
    return new Parens(e.ast());
  },
  Loop_forIn(_, id, n, l, colon, s) {
    return new ForStatement(id.sourceString, l.ast(), s.ast());
  },
  Loop_while(_, exp, colon, s) { return new WhileStatement(exp.ast(), s.ast()); },
  Loop_doUntil(_, col, s1, unt, col2, s2) {
    return new DoUntilStatement(s1.ast(), s2.ast());
  },
  Return(_, exp) { return new ReturnStatement(exp.ast()); },
  boollit(b) { return new BooleanLiteral(b.sourceString); },
  id(i) { return new IdLiteral(i.sourceString); },
  intlit(i) { return new IntegerLiteral(this.sourceString); },
  floatlit(iPart, dec, fracPart) { return new FloatLiteral(this.sourceString); },
  singlecomment(_, str, end) { return ''; },
  multicomment(_, str, end) { return ''; },
  // _terminal() {},
});

module.exports = (text) => {
  const match = grammar.match(text);
  if (match.succeeded()) {
    return semantics(match).ast();
  }
  return error(match.message);
};
