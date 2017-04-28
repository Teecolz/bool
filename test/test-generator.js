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
];

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
  }).toString().split('\n');
  expectedOut = expectedOut.slice(1, expectedOut.length - 1);
  jsCode.analyze();
  jsCode.gen();
  expectedOut = LIBRARY_FUNCTIONS.concat(expectedOut);
  expectedOut.forEach(o => console.info(o));
  assert.ok(console.log.called, 'log should have been called.');
  assert.equal(console.log.args.length, expectedOut.length);
  console.log.args.forEach((arg, index) => {
    assert.deepEqual(arg[0], expectedOut[index]);
  });
};
let test;

describe('Generator Tests', () => {
  beforeEach((done) => {
    this.logger = sinon.stub(console, 'log');
    this.error = sinon.stub(console, 'error');
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
          output: ['let test_2 = () => {', '  if (true) {', '    return false;', '  }', '};'],
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
          output: ['let test_2 = (param_3) => {', '  return param_3;', '};'],
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
          output: ['let var_2 = () => {', '  let x_3 = 0;', '  return x_3;', '};'],
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
          output: ['let test2_2 = () => {', '  if (true) {', '    return true;', '  }', '};'],
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
          output: ['let x_2 = \'test\';'],
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
          output: ['let op_2 = () => {', '  let x_3 = 5;', '  return (x_3 + 5);', '};'],
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
            'let bar_2 = (x_3, y_4, z_5, a_6, b_7, c_8) => {',
            '  return ((x_3 + y_4) > (z_5 ** b_7));',
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
          output: ['for (let x_2 = 0; x_2 < 1; x_2 += 1) {', '  print_1(x_2);', '}'],
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
          output: ['while (true) {', '  break;', '}'],
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
          output: ['let x_2 = 3.14;'],
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
          output: ['let x_2 = true;'],
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
          output: ['for (let x_2 = 0; x_2 < 25; x_2 += 1) {', '  print_1(x_2);', '}'],
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
          output: ['let test3_2 = () => {', '  if (true) {', '    return true;', '  } else {', '      return false;', '  }', '};'],
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
            '  cap(foo_2) {',
            '    let bopim_3 = (numBops_4) => {',
            '      for (let bop_5 = 0; bop_5 < numBops; bop_5 += 1) {',
            '        print_1((this.nameFirst + (" bopped " + (foo_2.nameFirst + (" " + (foo_2.nameLast + (" " + (bop_5 + " times"))))))));',
            '      }',
            '    };',
            '    return bopim_3;',
            '  }',
            '}',
            'class PoliceMan extends Person {',
            '  constructor(nameFirst, nameLast, age) {',
            '    this.nameFirst = nameFirst;',
            '    this.nameLast = nameLast;',
            '    this.age = age;',
            '    this.affiliation = "twelvy";',
            '  }',
            '  woopwoop() {',
            '    return "Time to narc";',
            '  }',
            '}',
            'let fiveO_6 = new PoliceMan("john", "doe", 24);',
            'let yg_7 = new Fam("yg", "hootie", 23);',
            'yg_7.cap(fiveO_6)(5);',
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
            'let a_2 = [];',
            'let b_3 = [1, 2, 3, 4, 5];',
            'b_3.forEach((x_4) => {',
            '  if ((x_4 > 1)) {',
            '    print_1(x_4);',
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
          output: ['let a_2 = [for (x_3 of [1, 2, 3]) (x_3 + 2)];'],
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
          output: ['let a_2 = [(1 + 4), (8 - 2), (5 * 5), (9 / 3)];'],
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
