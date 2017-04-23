const Context = require('./analyzer.js');
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
const DoUntilStatement = require('./entities/dountil.js');
const DoWhileStatement = require('./entities/dowhile.js');
const SimpleIf = require('./entities/simpleif.js');
const NormalStatement = require('./entities/normalstmt.js');
const IndentStatement = require('./entities/indentstmt.js');
const Statement = require('./entities/stmt.js');
const Type = require('./entities/type.js');
const ParameterDeclaration = require('./entities/paramdecl.js');
const FunctionParameters = require('./entities/funparams.js');

const indentPadding = 2;
const indentLevel = 0;

function emit(line) {
  console.log(`${' '.repeat(indentPadding * indentLevel)}${line}`);
}

function bracketIfNecessary(a) {
  if (a.length === 1) {
    return `${a}`;
  }
  return `[${a.join(', ')}]`;
}


const jsName = (() => {
  let lastId = 0;
  const map = new Map();
  return (v) => {
    if (!(map.has(v))) {
      map.set(v, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${v.id}_${map.get(v)}`;
  };
})();

function makeOp(op) {
  return { not: '!', '==': '===', '!=': '!==' }[op] || op;
}

// function generateLibraryFunctions() {
//   function generateLibraryStub(name, params, body) {
//     const entity = Context.INITIAL.variables[name];
//     emit(`function ${jsName(entity)} (${params}) {${body}}`);
//   }
//   // This is sloppy. There should be a better way to do this.
//   generateLibraryStub('print', 's', 'console.log(s);');
//   generateLibraryStub('sqrt', 'x', 'return Math.sqrt(x);');
// }

Object.assign(Program.prototype, {
  gen() {
    // generateLibraryFunctions();
    this.statements.forEach(statement => statement.gen());
  },
});

Object.assign(Parameters.prototype, {
  gen() { return this.expression.gen(); },
});

Object.assign(VariableAssignment.prototype, {
  gen() {
    const targets = this.targets.map(t => t.gen());
    const sources = this.sources.map(s => s.gen());
    emit(`${bracketIfNecessary(targets)} = ${bracketIfNecessary(sources)};`);
  },
});

Object.assign(VariableDeclaration.prototype, {
  gen() {
    const variables = this.variables.map(v => v.gen());
    const initializers = this.initializers.map(i => i.gen());
    emit(`let ${bracketIfNecessary(variables)} = ${bracketIfNecessary(initializers)};`);
  },
});

Object.assign(BinaryExpression.prototype, {
  gen() { return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`; },
});
