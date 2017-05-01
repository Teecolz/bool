/* eslint-env node */
/* eslint spaced-comment: "off" */

/************************
* DO NOT USE FAT ARROWS *
************************/

const BinaryExpression = require('./entities/binaryexpression.js');
const Block = require('./entities/block.js');
const BooleanLiteral = require('./entities/booleanliteral.js');
const BracketAccess = require('./entities/bracketaccess.js');
const Break = require('./entities/break.js');
const Case = require('./entities/case.js');
const ClassBody = require('./entities/classbody.js');
const ClassDeclaration = require('./entities/classdecl.js');
const ClassInstantiation = require('./entities/classinstantiation.js');
const ClassSuite = require('./entities/classsuite.js');
const ConditionalStatement = require('./entities/conditionalstatement.js');
const ConstructorDeclaration = require('./entities/constructordecl.js');
const error = require('./error');
const ExpList = require('./entities/explist.js');
const FieldAssignment = require('./entities/fieldassign.js');
const FieldDeclaration = require('./entities/fielddecl.js');
const FieldExpression = require('./entities/fieldexp.js');
const FieldParameters = require('./entities/fieldparams.js');
const FloatLiteral = require('./entities/floatliteral.js');
const ForStatement = require('./entities/forstatement.js');
const fs = require('fs');
const FunctionCall = require('./entities/funcall.js');
const FunctionDeclaration = require('./entities/fundecl.js');
const FunctionLiteral = require('./entities/functionliteral.js');
const FunctionParameters = require('./entities/funparams.js');
const IdLiteral = require('./entities/idliteral.js');
const IntegerLiteral = require('./entities/intliteral.js');
const ListExpression = require('./entities/listexp.js');
const ListLiteral = require('./entities/listliteral.js');
const MethodDeclaration = require('./entities/methoddecl.js');
const MethodParameters = require('./entities/methodparams.js');
const ObjectAccess = require('./entities/objectaccess.js');
const ObjectDeclaration = require('./entities/objdecl.js');
const ObjectLiteral = require('./entities/objectliteral.js');
const ohm = require('ohm-js');
const OpAssignment = require('./entities/opassign.js');
const ParameterDeclaration = require('./entities/paramdecl.js');
const Parameters = require('./entities/params.js');
const Preparser = require('./preparser.js');
const Program = require('./entities/program.js');
const PropertyDeclaration = require('./entities/propertydeclaration.js');
const RangeExpression = require('./entities/rangeexpression.js');
const ReturnStatement = require('./entities/returnstatement.js');
const SimpleIf = require('./entities/simpleif.js');
const Statement = require('./entities/stmt.js');
const StringLiteral = require('./entities/stringliteral.js');
const Suite = require('./entities/suite.js');
const Type = require('./entities/type.js');
const UnaryExpression = require('./entities/unaryexpression.js');
const VariableAssignment = require('./entities/varassignment.js');
const VariableDeclaration = require('./entities/variabledeclaration.js');
const VariableExpression = require('./entities/varexp.js');
const WhileStatement = require('./entities/whilestatement.js');

const grammar = ohm.grammar(fs.readFileSync('bool.ohm'));

/* eslint no-unused-vars: 1 */
const semantics = grammar.createSemantics().addOperation('ast', {
  Program(b) { return new Program(b.ast()); },
  Block(s) { return new Block(s.ast()); },
  FullStmt_simple(s, _) {
    const ast = s.ast();
    if (ast.length > 0) {
      return ast[0];
    }
    return ''; // if statment is just a newline
  },
  FullStmt_indent(s) { return s.ast(); },
  IndentStmt(s) { return new Statement(s.ast()); },
  SimpleStmt(s) { return new Statement(s.ast()); },
  Suite(nl, indent, s, _) {
    return new Suite(s.ast());
  },
  Params(open, ids, _) {
    return new Parameters(ids.ast());
  },
  ParamDecl(id, type) {
    return new ParameterDeclaration(id.ast(), type.ast());
  },
  Funparams(_, params, close) {
    return new FunctionParameters(params.ast());
  },
  ClassDecl(cl, id, isa, superId, col, cs) {
    return new ClassDeclaration(id.ast(), superId.ast(), cs.ast());
  },
  ClassSuite(nl, ind, cb, ded) {
    return new ClassSuite(cb.ast());
  },
  ClassBody(maker, nl, methods, _) {
    return new ClassBody(maker.ast(), methods.ast());
  },
  VarDecl(l, id, type, _, exp) {
    return new VariableDeclaration(id.sourceString, type.ast(), exp.ast());
  },
  OpAssign(id, op, e) {
    return new OpAssignment(id.sourceString, op.sourceString, e.ast());
  },
  Type_single(_, t) {
    return Type.Construct(t.sourceString);
  },
  Type_list(_, open, t, close) {
    return Type.Construct(`[${t.sourceString}]`);
  },
  VarAssignment(vexp, _, val) {
    return new VariableAssignment(vexp.ast(), val.ast());
  },
  VarExp_simple(name) {
    return new VariableExpression(name.sourceString);
  },
  VarExp_dotAccess(vexp, _, prop) {
    return new ObjectAccess(vexp.ast(), prop.ast());
  },
  VarExp_bracketAccess(vexp, open, exps, end) {
    return new BracketAccess(vexp.ast(), exps.ast());
  },
  FieldAssign(id, _, val) {
    return new FieldAssignment(id.ast(), val.ast());
  },
  fieldexp(id) {
    return new FieldExpression(id.sourceString);
  },
  FieldDecl(id, type) {
    return new FieldDeclaration(id.sourceString, type.ast());
  },
  FieldParams(open, ids, close) {
    return new FieldParameters(ids.ast());
  },
  ConstructorDecl_bodied(build, params, _, body) {
    return new ConstructorDeclaration(params.ast(), body.ast());
  },
  ConstructorDecl_noBody(build, params, _) {
    return new ConstructorDeclaration(params.ast());
  },
  MethodDecl(id, params, col, s) {
    return new MethodDeclaration(id.ast(), params.ast(), s.ast());
  },
  MethodParams(open, ids, close) {
    return new MethodParameters(ids.ast());
  },
  ObjDecl(id, col, nl, ind, props, nl2, ded) {
    return new ObjectDeclaration(id.ast(), props.ast());
  },
  PropertyDecl_typed(id, type, col, e) {
    return new PropertyDeclaration(id.ast(), type.ast(), e.ast());
  },
  PropertyDecl_noType(id, col, e) {
    return new PropertyDeclaration(id.ast(), [], e.ast());
  },
  FunDecl(f, id, type, params, col, s) {
    return new FunctionDeclaration(id.sourceString, type.ast(), params.ast(), s.ast());
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
  Objlit_singleline(_, prop1, comma, props, close) {
    return new ObjectLiteral(prop1.ast().concat(props.ast()));
  },
  Objlit_multiline(_, nl, ind, props, nl2, ded, close) {
    return new ObjectLiteral(props.ast());
  },
  Funlit(open, params, _, s, close) {
    return new FunctionLiteral(params.ast(), s.ast());
  },
  Range(_, exp, close) {
    return exp.ast();
  },
  RangeExp(st, _, end, com, neg, step) {
    return new RangeExpression(st.ast(), end.ast(), step.ast());
  },
  ClassInst(_, id, params) {
    return new ClassInstantiation(id.ast(), params.ast());
  },
  Funcall(id, params) {
    return new FunctionCall(id.ast(), params.ast());
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
  // Exp7_listAccess(e1, _, e2, close) {
  //   return new BinaryExpression(e1.ast(), '[]', e2.ast());
  // },
  // Exp7_access(e1, _, e2) {
  //   return new ObjectAccess(e1.ast(), e2.ast());
  // },
  Exp8_parens(_, e, close) {
    return e.ast();
  },
  MemberExp_dotAccess(vexp, _, prop) {
    return new ObjectAccess(vexp.ast(), prop.ast());
  },
  MemberExp_bracketAccess(vexp, open, exps, end) {
    return new BracketAccess(vexp.ast(), exps.ast());
  },
  Loop_forIn(_, id, n, l, colon, s) {
    return new ForStatement(id.sourceString, l.ast(), s.ast());
  },
  Loop_while(_, exp, colon, s) { return new WhileStatement(exp.ast(), s.ast()); },
  Return(_, exp) { return new ReturnStatement(exp.ast()); },
  breakstmt(txt) { return new Break(txt.sourceString); },
  boollit(b) { return new BooleanLiteral(b.sourceString); },
  id(i) { return new IdLiteral(i.sourceString); },
  intlit(i) { return new IntegerLiteral(this.sourceString); },
  floatlit(iPart, dec, fracPart) { return new FloatLiteral(this.sourceString); },
  singlecomment(_, str, end) { return ''; }, // str.source.sourceString.substring(0, str.source.sourceString.indexOf('\n'));
  multicomment(_, str, end) { return ''; },
});

module.exports = (text) => {
  const match = grammar.match(Preparser(text));
  if (match.succeeded()) {
    return semantics(match).ast();
  }
  return error(match.message);
};
