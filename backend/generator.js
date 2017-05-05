const BinaryExpression = require('../syntax/entities/binaryexpression.js');
const Block = require('../syntax/entities/block.js');
const BooleanLiteral = require('../syntax/entities/booleanliteral.js');
const Break = require('../syntax/entities/break.js');
const Case = require('../syntax/entities/case.js');
const ClassBody = require('../syntax/entities/classbody.js');
const ClassDeclaration = require('../syntax/entities/classdecl.js');
const ClassInstantiation = require('../syntax/entities/classinstantiation.js');
const ClassSuite = require('../syntax/entities/classsuite.js');
const ConditionalStatement = require('../syntax/entities/conditionalstatement.js');
const ConstructorDeclaration = require('../syntax/entities/constructordecl.js');
const Context = require('../semantics/analyzer.js');
const ExpList = require('../syntax/entities/explist.js');
const FieldAssignment = require('../syntax/entities/fieldassign.js');
const FieldDeclaration = require('../syntax/entities/fielddecl.js');
const FieldExpression = require('../syntax/entities/fieldexp.js');
const FieldParameters = require('../syntax/entities/fieldparams.js');
const FloatLiteral = require('../syntax/entities/floatliteral.js');
const ForStatement = require('../syntax/entities/forstatement.js');
const FunctionCall = require('../syntax/entities/funcall.js');
const FunctionDeclaration = require('../syntax/entities/fundecl.js');
const FunctionLiteral = require('../syntax/entities/functionliteral.js');
const FunctionParameters = require('../syntax/entities/funparams.js');
const IdLiteral = require('../syntax/entities/idliteral.js');
const IntegerLiteral = require('../syntax/entities/intliteral.js');
const ListExpression = require('../syntax/entities/listexp.js');
const ListLiteral = require('../syntax/entities/listliteral.js');
const MethodDeclaration = require('../syntax/entities/methoddecl.js');
const MethodParameters = require('../syntax/entities/methodparams.js');
const ObjectAccess = require('../syntax/entities/objectaccess.js');
const ObjectDeclaration = require('../syntax/entities/objdecl.js');
const ObjectLiteral = require('../syntax/entities/objectliteral.js');
const OpAssignment = require('../syntax/entities/opassign.js');
const ParameterDeclaration = require('../syntax/entities/paramdecl.js');
const Parameters = require('../syntax/entities/params.js');
const Program = require('../syntax/entities/program.js');
const PropertyDeclaration = require('../syntax/entities/propertydeclaration.js');
const RangeExpression = require('../syntax/entities/rangeexpression.js');
const ReturnStatement = require('../syntax/entities/returnstatement.js');
const SimpleIf = require('../syntax/entities/simpleif.js');
const Statement = require('../syntax/entities/stmt.js');
const StringLiteral = require('../syntax/entities/stringliteral.js');
const Suite = require('../syntax/entities/suite.js');
const UnaryExpression = require('../syntax/entities/unaryexpression.js');
const VariableAssignment = require('../syntax/entities/varassignment.js');
const VariableDeclaration = require('../syntax/entities/variabledeclaration.js');
const VariableExpression = require('../syntax/entities/varexp.js');
const WhileStatement = require('../syntax/entities/whilestatement.js');

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

function getOp(op) {
  if (op === 'and') {
    return '&&';
  }
  if (op === 'or') {
    return '||';
  }
  return op;
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

let jsName = (() => {
  let lastId = 0;
  const map = new Map();
  return (v) => {
    if (!(map.has(v))) {
      map.set(v, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${v.id}_${map.get(v)}`;
  };
})();

const resetJsName = (() => {
  jsName = (() => {
    let lastId = 0;
    const map = new Map();
    return (v) => {
      if (!(map.has(v))) {
        map.set(v, ++lastId); // eslint-disable-line no-plusplus
      }
      return `${v.id}_${map.get(v)}`;
    };
  })();
});

exports.resetJsName = resetJsName;

function makeBoolean(bool) {
  return { tru: 'true', fal: 'false', true: 'true', false: 'false' }[bool];
}

function generateLibraryFunctions() {
  function generateLibraryStub(name, params, body) {
    const entity = Context.LIBRARY.lookupVariable(name);
    emit(`function ${jsName(entity)}(${params}) {${body}}`);
  }

  generateLibraryStub('print', 's', 'console.log(s);');
  generateLibraryStub('map', ['f', 'arr'], 'return arr.map(f);');
}

/* *****************
   * BASE ENTITIES *
   *****************/
Object.assign(Block.prototype, {
  gen() {
    this.body.forEach((stmt) => {
      if (stmt) {
        stmt.gen();
      }
    });
  },
});

Object.assign(Parameters.prototype, {
  gen() {
    let paramString = '';
    this.params.forEach((p) => { paramString += `${p.gen()}, `; });
    paramString = paramString.replace(/, $/, '');
    return paramString;
  },
});

Object.assign(ParameterDeclaration.prototype, {
  gen() {
    return jsName(this);
  },
});

Object.assign(Program.prototype, {
  gen() {
    generateLibraryFunctions();
    this.block.gen();
  },
});

Object.assign(VariableAssignment.prototype, {
  gen() {
    return `${this.target.gen()} = ${this.source.gen()}`;
  },
});

Object.assign(VariableDeclaration.prototype, {
  gen() {
    return (this.value) ? `let ${jsName(this)} = ${this.value.gen()}` : `let ${jsName(this)}`;
  },
});

/* *************
   *  CLASSES  *
   *************/
Object.assign(ClassBody.prototype, {
  gen() {
    this.builder.gen();
    this.methods.forEach((m) => {
      m.gen();
    });
  },
});

Object.assign(ClassSuite.prototype, {
  gen() {
    this.body.gen();
  },
});

Object.assign(ClassDeclaration.prototype, {
  gen() {
    let prefix = `class ${this.id} `;
    prefix += this.superClass ? `extends ${this.superClass.id} {` : '{';
    emit(prefix);
    indentLevel += 1;
    this.body.gen();
    indentLevel -= 1;
    emit('}');
  },
});

Object.assign(ConstructorDeclaration.prototype, {
  gen() {
    const generatedParams = this.params.gen();
    emit(`constructor(${generatedParams.join(', ')}) {`);
    if (this.body) {
      this.params.params.forEach((param) => {
        if (param instanceof FieldDeclaration) {
          emit(`  this.${param.gen()} = ${param.gen()};`); // assign instance fields
        }
      });
      genStatementList(this.body);
    } else {
      generatedParams.forEach((param) => {
        emit(`  this.${param} = ${param};`);
      });
    }
    emit('}');
  },
});

Object.assign(FieldAssignment.prototype, {
  gen() {
    const fieldNoPrefix = `${this.target}`.replace(/^_/, '');
    emit(`this.${fieldNoPrefix} = ${this.source.gen()};`);
  },
});

Object.assign(FieldDeclaration.prototype, {
  gen() {
    return `${this.id}`.replace(/^_/, '');
  },
});

Object.assign(FieldExpression.prototype, {
  gen() {
    return `this.${this.id.replace(/^_/, '')}`;
  },
});

Object.assign(FieldParameters.prototype, {
  gen() {
    return this.params.map(p => p.gen());
  },
});

Object.assign(MethodDeclaration.prototype, {
  gen() {
    emit(`${jsName(this)}(${this.params.gen()}) {`);
    this.block.gen();
    emit('}');
  },
});

Object.assign(MethodParameters.prototype, {
  gen() {
    return this.params.map(p => p.gen());
  },
});

/* ***************
   * EXPRESSIONS *
   ***************/
Object.assign(BinaryExpression.prototype, {
  gen() {
    return `(${this.left.gen()} ${getOp(this.op)} ${this.right.gen()})`;
  },
});

Object.assign(ObjectAccess.prototype, {
  gen() {
    if (this.isObjectContext) {
      return `${this.container.gen()}.${jsName(this.val)}`;
    }
    return `${this.container.gen()}.${this.prop.gen(true)}`;
  },
});

Object.assign(OpAssignment.prototype, {
  gen() {
    let targetString = `${this.target.gen()}`;
    if (this.target instanceof FieldDeclaration) {
      targetString = `this.${targetString}`;
    }
    return `${targetString} ${this.op} ${this.source.gen()}`;
  },
});

Object.assign(UnaryExpression.prototype, {
  gen() { return `${this.op}${this.operand instanceof VariableExpression ? jsName(this.operand.referent) : this.operand}`; },
});

Object.assign(VariableExpression.prototype, {
  gen() {
    return jsName(this.referent);  // will break before analysis
  },
});

/* ****************
   * CONDITIONALS *
   ****************/
Object.assign(Case.prototype, {
  gen() {

  },
});

Object.assign(ConditionalStatement.prototype, {
  gen() {
    this.cases.forEach((c, index) => {
      const prefix = index === 0 ? 'if' : '} else if';
      emit(`${prefix} (${c.condition.gen()}) {`);
      c.body.gen();
    });
    if (this.block) {
      emit('} else {');
      this.block.gen(); // this might be wrong
    }
    emit('}');
  },
});

Object.assign(SimpleIf.prototype, {
  gen() {
    return `${this.exp.gen()}`;
  },
});

/* *********
   * LOOPS *
   *********/
Object.assign(ForStatement.prototype, {
  gen() {
    const list = this.list;
    const jsIterator = jsName(this);
    if (list instanceof RangeExpression) {
      const boundsCheck = list.step > 0 ? '<' : '>';
      const start = list.start instanceof IntegerLiteral ? list.start : jsName(list.start);
      const end = list.end instanceof IntegerLiteral ? list.end : jsName(list.end);
      const step = list.step instanceof IntegerLiteral ? list.step : jsName(list.step);
      emit(`for (let ${jsIterator} = ${start}; ${jsIterator} ${boundsCheck} ${end}; ${jsIterator} += ${step}) {`);
      this.block.gen();
      emit('}');
    } else {
      emit(`${list.gen()}.forEach((${jsIterator}) => {`);
      this.block.gen();
      emit('});');
    }
  },
});

Object.assign(WhileStatement.prototype, {
  gen() {
    emit(`while ${this.condition.gen()} {`);
    this.body.gen();
    emit('}');
  },
});

/* *************
   * FUNCTIONS *
   *************/

Object.assign(FunctionCall.prototype, {
  gen() {
    if (this.callee instanceof FunctionLiteral) {
      return `${this.callee.gen()}${this.params.map(p => `(${p.gen()})`).join('')}`;
    }
    return `${jsName(this.callee)}${this.params.map(p => `(${p.gen()})`).join('')}`;
  },
});

Object.assign(FunctionDeclaration.prototype, {
  gen() {
    emit(`let ${jsName(this)} = (${this.params.gen()}) => {`);
    this.body.gen();
    emit('};');
  },
});

Object.assign(FunctionLiteral.prototype, {
  gen() {
    let funText = `((${this.params.gen()}) => `;
    if (this.body instanceof Suite) {
      funText += '{ ';
      this.body.stmts.forEach((stmt) => { funText += `${stmt.stmt.gen()}; `; });
      funText += '})';
    } else {
      funText += `${this.body.gen()})`;
    }
    return funText;
  },
});

Object.assign(FunctionParameters.prototype, {
  gen() {
    return this.params.map(p => p.gen()).join(', ');
  },
});

/* **************
   * STATEMENTS *
   **************/
Object.assign(Break.prototype, {
  gen() { return 'break'; },
});

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

Object.assign(Suite.prototype, {
  gen() {
    getStatementList(this.stmts);
  },
});

/* ************
   * LITERALS *
   ************/

  /* ************
   * SIMPLELITS *
   **************/
Object.assign(BooleanLiteral.prototype, {
  gen() {
    return `${makeBoolean(this.val)}`;
  },
});

Object.assign(ClassInstantiation.prototype, {
  gen() {
    return `new ${this.id}(${this.params.gen()})`;
  },
});

Object.assign(FloatLiteral.prototype, {
  gen() {
    return `${this.val}`;
  },
});

Object.assign(IdLiteral.prototype, {
  gen(isAccess) {
    if (!isAccess) {
      return `${jsName(this)}`;
    }
    return `${this}`;
  },
});

Object.assign(IntegerLiteral.prototype, {
  gen() {
    return `${this.val}`;
  },
});

Object.assign(StringLiteral.prototype, {
  gen() { return `${this}`; },
});

  /* *********
     * LISTS *
     *********/
Object.assign(ExpList.prototype, {
  gen() {
    const listElements = [];
    this.exps.forEach((el) => {
      listElements.push(el.gen());
    });
    return `[${listElements.join(', ')}]`;
  },
});

Object.assign(ListExpression.prototype, {
  gen() {
    let expression = `.map((${jsName(this.iterator)}) => ${this.exp.gen()})`;
    const listName = this.lst instanceof VariableExpression ? `${jsName(this.lst.referent)}` : `${this.lst}`;
    if (this.cond[0]) {
      expression = `${listName}.filter((${jsName(this.iterator)}) => ${this.cond[0].gen()})${expression}`;
    } else {
      expression = `${listName}${expression}`;
    }
    return expression;
  },
});

Object.assign(ListLiteral.prototype, {
  gen() {
    if (this.exp[0]) {
      return `${this.exp[0].gen()}`;
    }
    return '[]';
  },
});

  /* ***********
     * OBJECTS *
     ***********/
Object.assign(PropertyDeclaration.prototype, {
  gen() {
    return `${jsName(this)}: ${this.val.gen()}`; // TODO: what to do about multiline values?
  },
});

Object.assign(ObjectDeclaration.prototype, {
  gen() {
    emit(`let ${jsName(this)} = {`);
    indentLevel += 1;
    this.propDecls.forEach(p => emit(`${p.gen()},`));
    indentLevel -= 1;
    emit('};');
  },
});

Object.assign(ObjectLiteral.prototype, {
  gen() {
    return `{${this.props.map(p => p.gen()).join(', ')}}`;
  },
});
