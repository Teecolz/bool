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
const IntegerLiteral = require('./entities/intliteral.js');
const ListExpression = require('./entities/listexp.js');
const ListLiteral = require('./entities/listliteral.js');
const MethodDeclaration = require('./entities/methoddecl.js');
const ObjectDeclaration = require('./entities/objdecl.js');
const ObjectLiteral = require('./entities/objectliteral.js');
const Parameters = require('./entities/params.js');
const Program = require('./entities/program.js');
const PropertyDeclaration = require('./entities/propertydeclaration.js');
const RangeExpression = require('./entities/rangeexpression.js');
const ReturnStatement = require('./entities/returnstatement.js');
const SimpleIf = require('./entities/simpleif.js');
const Statement = require('./entities/stmt.js');
const StringLiteral = require('./entities/stringliteral.js');
const Suite = require('./entities/suite.js');
const UnaryExpression = require('./entities/unaryexpression.js');
const VariableAssignment = require('./entities/varassignment.js');
const VariableDeclaration = require('./entities/variabledeclaration.js');
const VariableExpression = require('./entities/varexp.js');
const WhileStatement = require('./entities/whilestatement.js');

const indentPadding = 2;
let indentLevel = 0;

exports.EMIT_DESTINATION = undefined; // to define output location

function emit(line) {
  const output = `${' '.repeat(indentPadding * indentLevel)}${line}`;
  console.log(output);
}

function genStatementList(statements) {
  indentLevel += 1;
  statements.stmts.forEach(statement => statement.gen());
  indentLevel -= 1;
}

function preEmit(line) {
  return `${' '.repeat(indentPadding * indentLevel)}${line}`;
}

function getStatementList(statements) {
  indentLevel += 1;
  statements.forEach((statement) => {
    if (statement !== '' && statement !== []) {
      statement.gen();
    }
  });
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


function makeBoolean(bool) {
  return { tru: 'true', fal: 'false' }[bool];
}

function generateLibraryFunctions() {
  function generateLibraryStub(name, params, body) {
    const entity = Context.LIBRARY.lookupVariable(name);
    emit(`function ${jsName(entity)} (${params}) {${body}}`);
  }

  generateLibraryStub('print', 's', 'console.log(s);');
}

Object.assign(Program.prototype, {
  gen() {
    generateLibraryFunctions();
    this.block.gen();
  },
});

Object.assign(Block.prototype, {
  gen() {
    this.body.forEach((stmt) => {
      if (stmt) {
        stmt.gen();
      }
    });
  },
});

Object.assign(FunctionDeclaration.prototype, {
  gen() {
    emit(`function ${jsName(this)} (${this.params.params.map(p => p.gen()).join(', ')}) {`);
    genStatementList(this.body);
    emit('}');
  },
});

Object.assign(Parameters.prototype, {
  gen() {
    let paramString = '';
    this.params.forEach((p) => { paramString += `${p}, `; });
    paramString = paramString.replace(/, $/, '');
    return paramString;
  },
});

Object.assign(VariableAssignment.prototype, {
  gen() {
    return `${this.target.gen()} = ${this.source.gen()}`;
  },
});

Object.assign(VariableDeclaration.prototype, {
  gen() {
    return `let ${this.name} = ${this.value}`;
  },
});

/* *************
 * EXPRESSIONS *
 ***************/

Object.assign(VariableExpression.prototype, {
  gen() { return `${this.name}`; },
});


Object.assign(BinaryExpression.prototype, {
  gen() { return `(${this.left.gen()} ${this.op} ${this.right.gen()})`; },
});

Object.assign(UnaryExpression.prototype, {
  gen() { return `${this.op}${this.operand}`; },
});

/* **************
 * CONDITIONALS *
 ****************/
Object.assign(SimpleIf.prototype, {
  gen() {
    return `${this.name}`;
  },
});

Object.assign(Case.prototype, {
  gen() {

  },
});

Object.assign(ConditionalStatement.prototype, {
  gen() {
    // console.log(this);
    this.cases.forEach((c, index) => {
      const prefix = index === 0 ? 'if' : '} else if';
      emit(`${prefix} (${c.condition.gen()}) {`);
      c.body.gen();
    });
    if (this.block.length > 0) {
      emit('} else {');
      getStatementList(this.block);
    }
    emit('}');
  },
});

/* *******
 * LOOPS *
 *********/
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
 *  FUNCTIONS *
 **************/

Object.assign(FunctionLiteral.prototype, {
  gen() {
    let funText = `(${this.params.gen()}) => `;
    if (this.body instanceof Suite) {
      funText += '{\n';
      const bodyAr = getLinesAsArray(this.body.stmts);
      bodyAr.forEach((line) => { funText += line; });
      funText += '}';
    } else {
      funText += `${this.body.gen()}`;
    }
    return funText;
  },
});

Object.assign(FunctionDeclaration.prototype, {
  gen() {
    for (const statement in this.stmt) {
      if (typeof this.stmt[statement] === 'object') {
        (this.stmt[statement]).gen();
      }
    }
    emit(`let ${this.id} = (${this.params.gen()}) => {`);
    this.body.gen();
    emit('};');
  },
});

Object.assign(FunctionCall.prototype, {
  gen() {
    this.stmt.gen();
    return `${this.id}${this.params.map(p => `(${p.gen()})`).join('')}`;
  },
});

Object.assign(FunctionParameters.prototype, {
  gen() {
    return this.params.map(p => p.gen()).join(', ');
  },
});

/* ************
 * STATEMENTS *
 **************/

Object.assign(ReturnStatement.prototype, {
  gen() { return `return ${this.returnValue.gen()}`; },
});

Object.assign(Statement.prototype, {
  gen() {
    const generated = (this.stmt.gen());
    if (generated) {
      emit(`${generated};`); // only emits statements that are not yet emitted
    }
  },
});

Object.assign(DoUntilStatement.prototype, {
  gen() {
    emit('do:');
    this.doSuite.gen();
    emit(`while${this.untilExp.gen()}`);
  },
});

Object.assign(Suite.prototype, {
  gen() {
    getStatementList(this.stmts);
  },
});

/* ************
 *  LITERALS  *
 **************/
Object.assign(BooleanLiteral.prototype, {
  gen() { return `${makeBoolean(this.val)}`; },
});

Object.assign(ExpList.prototype, {
  gen() { return `${this.exps}`; },
});

Object.assign(FloatLiteral.prototype, {
  gen() {
    return `${this.val}`;
  },
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

Object.assign(StringLiteral.prototype, {
  gen() { return `${this.val}`; },
});
