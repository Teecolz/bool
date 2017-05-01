/* eslint-env node, mocha */
/* eslint no-void: 0 */
const fs = require('fs');
const assert = require('assert');
const parse = require('../parser.js');
const sinon = require('sinon');
require('../generator.js');
const resetJsName = require('../generator.js').resetJsName;

const LIBRARY_FUNCTIONS = [
  'function print_1(s) {console.log(s);}',
  'function map_2(f,arr) {return arr.map(f);}',
];

const libraryPrefixes = { print: 1, map: 2 };
const nameParser = (match, p1, p2) => {
  if (p1) {
    return `_${+p1.substr(1) + LIBRARY_FUNCTIONS.length}`;
  } if (p2) {
    return `${p2.substr(2)}_${libraryPrefixes[p2.substr(2)]}`;
  }
  return '';
};

const getJSNameNum = (numLibFunctions) => {
  const curNum = numLibFunctions;
  return offSet => (curNum + offSet);
};

// Setup output files
const jsGenTest = (testDatum) => {
  const jsCode = parse(fs.readFileSync(`test/data/generator/${testDatum.argFile}.bool`, {
    encoding: 'UTF-8',
  }));
  jsCode.analyze();
  jsCode.gen();
  const expected = testDatum.expected;
  const expectedOut = LIBRARY_FUNCTIONS.concat(expected.output);
  assert.ok(console.log.called, 'log should have been called.');
  assert.equal(console.log.args.length, expectedOut.length);
  console.log.args.forEach((arg, index) => {
    assert.deepEqual(arg[0], expectedOut[index]);
  });
};

// Setup output files
const jsGenTestWithOutFile = (testDatum) => {
  const jsCode = parse(fs.readFileSync(`test/data/generator/${testDatum}.bool`, {
    encoding: 'UTF-8',
  }));
  let expectedOut = fs.readFileSync(`test/data/generator/output/${testDatum}-out.js`, {
    encoding: 'UTF-8',
  }).toString().replace(/(_\d+)|(__\w+)/g, nameParser).split('\n');
  // have to get rid of trailing newline and eslint comment
  expectedOut = expectedOut.slice(1, expectedOut.length - 1);
  jsCode.analyze();
  jsCode.gen();
  expectedOut = LIBRARY_FUNCTIONS.concat(expectedOut);
  assert.ok(console.log.called, 'log should have been called.');
  assert.equal(console.log.args.length, expectedOut.length);
  console.log.args.forEach((arg, index) => {
    assert.deepEqual(arg[0], expectedOut[index]);
  });
};
let test;
let getNum;

describe('Generator Tests', () => {
  beforeEach((done) => {
    this.logger = sinon.stub(console, 'log');
    this.error = sinon.stub(console, 'error');
    getNum = getJSNameNum(LIBRARY_FUNCTIONS.length);
    done();
  });
  afterEach((done) => {
    this.logger.restore();
    this.error.restore();
    resetJsName();
    done();
  });

  describe('Hello World Test', () => {
    it('Should properly generate "Hello, world!""', (done) => {
      test = {
        argFile: 'helloworld',
        expected: {
          output: ['print_1("Hello, world!");'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Function Tests', () => {
    it('Should properly generate a basic function', (done) => {
      test = {
        argFile: 'fun',
        expected: {
          output: [`let test_${getNum(1)} = () => {`, '  if (true) {', '    return false;', '  }', '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });

    it('Should properly generate a function with params', (done) => {
      test = {
        argFile: 'funparams',
        expected: {
          output: [`let test_${getNum(1)} = (param_${getNum(2)}) => {`, `  return param_${getNum(2)};`, '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Variable Tests', () => {
    it('Should properly generate a basic function', (done) => {
      test = {
        argFile: 'var',
        expected: {
          output: [`let var_${getNum(1)} = () => {`, `  let x_${getNum(2)} = 0;`, `  return x_${getNum(2)};`, '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('If Tests', () => {
    it('Should properly generate an if statement', (done) => {
      test = {
        argFile: 'if',
        expected: {
          output: [`let test2_${getNum(1)} = () => {`, '  if (true) {', '    return true;', '  }', '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Statement & StringLit Test', () => {
    it('Should properly generate a normal statement with a string', (done) => {
      test = {
        argFile: 'stmt',
        expected: {
          output: [`let x_${getNum(1)} = 'test';`],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

    // describe('Object Test', () => {
    //     it('Should properly generate an object', (done) => {
    //         test = {
    //             argFile: 'objdecl',
    //             expected: {
    //                 output: ['{ test }'],
    //                 numLogs: 1
    //             },
    //         };
    //         jsGenTest(test);
    //         done();
    //     });
    // });

  describe('Op & Return Test', () => {
    it('Should properly generate a return statement containing an op', (done) => {
      test = {
        argFile: 'op',
        expected: {
          output: [`let op_${getNum(1)} = () => {`, `  let x_${getNum(2)} = 5;`, `  return (x_${getNum(2)} + 5);`, '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });

    it('Should properly generate a function returning a complex expression', (done) => {
      test = {
        argFile: 'op2',
        expected: {
          output: [
            `let bar_${getNum(1)} = (x_${getNum(2)}, y_${getNum(3)}, z_${getNum(4)}, a_${getNum(5)}, b_${getNum(6)}, c_${getNum(7)}) => {`,
            `  return ((x_${getNum(2)} + y_${getNum(3)}) > (z_${getNum(4)} ** b_${getNum(6)}));`,
            '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Range Test', () => {
    it('Should properly generate a range expression', (done) => {
      test = {
        argFile: 'range',
        expected: {
          output: [`for (let x_${getNum(1)} = 0; x_${getNum(1)} < 1; x_${getNum(1)} += 1) {`, `  print_1(x_${getNum(1)});`, '}'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('While & Unary Expression Test', () => {
    it('Should properly generate a while statement', (done) => {
      test = {
        argFile: 'while',
        expected: {
          output: ['while true {', '  break;', '}'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Float Literal Test', () => {
    it('Should properly generate a float literal', (done) => {
      test = {
        argFile: 'float',
        expected: {
          output: [`let x_${getNum(1)} = 3.14;`],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Boolean Literal Test', () => {
    it('Should properly generate a boolean literal', (done) => {
      test = {
        argFile: 'bool',
        expected: {
          output: [`let x_${getNum(1)} = true;`],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('For Statement Test', () => {
    it('Should properly generate a for statement', (done) => {
      test = {
        argFile: 'for',
        expected: {
          output: [`for (let x_${getNum(1)} = 0; x_${getNum(1)} < 25; x_${getNum(1)} += 1) {`, `  print_1(x_${getNum(1)});`, '}'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Conditional Test', () => {
    it('Should properly generate a conditional statement', (done) => {
      test = {
        argFile: 'conditional',
        expected: {
          output: [`let test3_${getNum(1)} = () => {`, '  if (true) {', '    return true;', '  } else {', '      return false;', '  }', '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Class Test', () => {
    it('Should properly generate a complex class', (done) => {
      test = {
        argFile: 'complex-class',
        expected: {
          output: [
            'class Person {',
            '  constructor(nameFirst, nameLast, age) {',
            '    this.nameFirst = nameFirst;',
            '    this.nameLast = nameLast;',
            '    this.age = age;',
            '  }',
            '}',
            'class Fam extends Person {',
            '  constructor(nameFirst, nameLast, age) {',
            '    this.nameFirst = nameFirst;',
            '    this.nameLast = nameLast;',
            '    this.age = age;',
            '    this.affiliation = "blood";',
            '  }',
            `  cap_${getNum(1)}(foo_${getNum(2)}) {`,
            `    let bopim_${getNum(3)} = (numBops_${getNum(4)}) => {`,
            `      for (let bop_${getNum(5)} = 0; bop_${getNum(5)} < numBops_${getNum(4)}; bop_${getNum(5)} += 1) {`,
            `        print_1((this.nameFirst + (" bopped " + (foo_${getNum(2)}.nameFirst + (" " + (foo_${getNum(2)}.nameLast + (" " + (bop_${getNum(5)} + " times"))))))));`,
            '      }',
            '    };',
            `    return bopim_${getNum(3)};`,
            '  }',
            '}',
            'class PoliceMan extends Person {',
            '  constructor(nameFirst, nameLast, age) {',
            '    this.nameFirst = nameFirst;',
            '    this.nameLast = nameLast;',
            '    this.age = age;',
            '    this.affiliation = "twelvy";',
            '  }',
            `  woopwoop_${getNum(6)}() {`,
            '    return "Time to narc";',
            '  }',
            '}',
            `let fiveO_${getNum(7)} = new PoliceMan("john", "doe", 24);`,
            `let yg_${getNum(8)} = new Fam("yg", "hootie", 23);`,
            `yg_${getNum(8)}.cap_${getNum(1)}(fiveO_${getNum(7)})(5);`,
          ],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });


  describe('List Literal Test', () => {
    it('Should properly generate list literals', (done) => {
      test = {
        argFile: 'list',
        expected: {
          output: [
            `let a_${getNum(1)} = [];`,
            `let b_${getNum(2)} = [1, 2, 3, 4, 5];`,
            `b_${getNum(2)}.forEach((x_${getNum(3)}) => {`,
            `  if ((x_${getNum(3)} > 1)) {`,
            `    print_1(x_${getNum(3)});`,
            '  }',
            '});',
          ],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('ListExp Test', () => {
    it('Should properly generate a list expression', (done) => {
      test = {
        argFile: 'listexp',
        expected: {
          output: [`let a_${getNum(1)} = [for (x_${getNum(2)} of [1, 2, 3]) (x_${getNum(2)} + 2)];`],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('ExpList Test', () => {
    it('Should properly generate an expression list', (done) => {
      test = {
        argFile: 'explist',
        expected: {
          output: [`let a_${getNum(1)} = [(1 + 4), (8 - 2), (5 * 5), (9 / 3)];`],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('Complex HOF Test', () => {
    it('Should properly generate HOFS', (done) => {
      test = 'higher-order';
      jsGenTestWithOutFile(test);
      done();
    });
  });
});
