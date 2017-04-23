const Assignment = require('./entities/assign.js');
const BinaryExpression = require('./entities/binaryexpression.js');
const Block = require('./entities/block.js');
const BooleanLiteral = require('./entities/booleanliteral.js');
const Case = require('./entities/case.js');
const ClassBody = require('./entities/classbody.js');
const ClassDeclaration = require('./entities/classdecl.js');
const ClassInstantiation = require('./entities/classinstantiation.js');
const ClassSuite = require('./entities/classsuite.js');
const ConditionalStatement = require('./entities/conditionalstatement.js');
const Context = require('./analyzer.js');
const DoUntilStatement = require('./entities/dountil.js');
const DoWhileStatement = require('./entities/dowhile.js');
const ExpList = require('./entities/explist.js');
const FieldDeclaration = require('./entities/fielddecl.js');
const FloatLiteral = require('./entities/floatliteral.js');
const ForStatement = require('./entities/forstatement.js');
const FunctionCall = require('./entities/funcall.js');
const FunctionDeclaration = require('./entities/fundecl.js');
const FunctionLiteral = require('./entities/functionliteral.js');
const FunctionParameters = require('./entities/funparams.js');
const IdLiteral = require('./entities/idliteral.js');
const IndentStatement = require('./entities/indentstmt.js');
const IntegerLiteral = require('./entities/intliteral.js');
const ListExpression = require('./entities/listexp.js');
const ListLiteral = require('./entities/listliteral.js');
const MethodDeclaration = require('./entities/methoddecl.js');
const NormalStatement = require('./entities/normalstmt.js');
const ObjectDeclaration = require('./entities/objdecl.js');
const ObjectLiteral = require('./entities/objectliteral.js');
const ParameterDeclaration = require('./entities/paramdecl.js');
const Parameters = require('./entities/params.js');
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

const indentPadding = 2;
let indentLevel = 0;

function emit(line) {
  console.log(`${' '.repeat(indentPadding * indentLevel)}${line}`);
}

function preEmit(line) {
  return `${' '.repeat(indentPadding * indentLevel)}${line}`;
}

function getStatementList(statements) {
  indentLevel += 1;
  statements.forEach(statement => statement.gen());
  indentLevel -= 1;
}

function getLinesAsArray(statements) {
  indentLevel += 1;
  const lineArray = statements.map(s => preEmit(s.gen()));
  indentLevel -= 1;
  return lineArray;
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

function makeBoolean(bool) {
  return { tru: 'true', fal: 'false' }[bool];
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
    this.block.gen();
  },
});

Object.assign(Block.prototype, {
  gen() {
    this.body.forEach(statement => statement.gen());
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

Object.assign(VariableExpression.prototype, {
  gen() { return `${this.name}`; },
});

Object.assign(BinaryExpression.prototype, {
  gen() { return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`; },
});

Object.assign(ConditionalStatement.prototype, {
  gen() {
    this.cases.forEach((c, index) => {
      const prefix = index === 0 ? 'if' : '} else if';
      emit(`${prefix} (${c.condition.gen()}) {`);
      c.body.gen();
    });
    if (this.block.length > 0) {
      emit('} else {');
      this.block.gen();
    }
    emit('}');
  },
});

Object.assign(ReturnStatement.prototype, {
  gen() { emit(`return ${this.returnValue.gen()};`); },
});

Object.assign(WhileStatement.prototype, {
  gen() {
    emit(`while (${this.condition}) {`);
    this.body.gen();
    emit('}');
  },
});

Object.assign(ForStatement.prototype, {
  gen() {
    const list = this.list;
    if (list instanceof RangeExpression) {
      const boundsCheck = list.step > 0 ? '<' : '>';
      emit(`for (let ${this.iterator} = ${list.start}; ${this.iterator} ${boundsCheck} ${list.end}; ${this.iterator} += ${list.step}) {`);
      this.block.gen();
      emit('}');
    } else {
      emit(`${list.gen()}.forEach((${this.iterator}) => {`);
      this.block.gen();
      emit('});');
    }
  },
});

/* ************
 * Statements *
 **************/
Object.assign(NormalStatement.prototype, {
  gen() {
    if (this.stmt) {
      this.stmt.gen();
    } else {
      emit('');
    }
  },
});

Object.assign(IndentStatement.prototype, {
  gen() {
    this.stmt.gen();
  },
});

Object.assign(Statement.prototype, {
  gen() {
    this.stmt.gen();
  },
});

Object.assign(Suite.prototype, {
  gen() {
    getStatementList(this.stmts);
  },
});


/* ************
 *  Literals  *
 **************/
Object.assign(BooleanLiteral.prototype, {
  gen() { return `${makeBoolean(this.val)}`; },
});

Object.assign(ExpList.prototype, {
  gen() { return `${this.exps}`; },
});

Object.assign(IdLiteral.prototype, {
  gen() { return `${this.id}`; },
});

Object.assign(IntegerLiteral.prototype, {
  gen() {
    return `${this.val}`;
  },
});

Object.assign(ListExpression.prototype, {
  gen() {
    let expression = `for (${this.iterator} of ${this.lst}) `;
    if (this.cond) {
      expression += `if (${this.cond}) `;
    }
    expression += `${this.exp}`;
    return expression;
  },
});

Object.assign(ListLiteral.prototype, {
  gen() {
    const list = this.exp;
    return `[${list.gen()}]`;
  },
});

Object.assign(PropertyDeclaration.prototype, {
  gen() {
    return `${this.key}: ${this.val.gen()},`; // TODO: what to do about multiline values?
  },
});

Object.assign(ObjectLiteral.prototype, {
  gen() {
    let objectString = '{\n';
    getLinesAsArray(this.props).forEach((p) => {
      objectString += `${p}\n`;
    });
    objectString += preEmit('}');
    return objectString;
  },
});
