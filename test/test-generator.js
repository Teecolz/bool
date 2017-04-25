/* eslint-env node, mocha */
/* eslint no-void: 0 */
const fs = require('fs');
const assert = require('assert');
const parse = require('../parser.js');
const sinon = require('sinon');
require('../generator.js');

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

let test;

describe('Generator Tests', () => {
  beforeEach((done) => {
    sinon.stub(console, 'log').returns(void 0);
    sinon.stub(console, 'error').returns(void 0);
    done();
  });
  afterEach((done) => {
    console.log.restore();
    console.error.restore();
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
          output: ['let test_3 = (param_4) => {', '  return param_4;', '};'],
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
          output: ['let var_5 = () => {', '  let x_6 = 0;', '  return x_6;', '};'],
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
          output: ['let test2_7 = () => {', '  if (true) {', '    return true;', '  }', '};'],
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
          output: ['let x_8 = \'test\';'],
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
          output: ['let op_9 = () => {', '  let x_10 = 5;', '  return (x_10 + 5);', '};'],
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
          output: ['let bar_11 = (x_12, y_13, z_14, a_15, b_16, c_17) => {', '  return ((x_12 + y_13) > (z_14 ** b_16));', '};'],
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
          output: ['for (let x_18 = 0; x_18 < 1; x_18 += 1) {', '  print_1(x_18);', '}'],
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
          output: ['let x_19 = 3.14;'],
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
          output: ['let x_20 = true;'],
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
          output: ['for (let x_21 = 0; x_21 < 25; x_21 += 1) {', '  print_1(x_21);', '}'],
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
          output: ['let test3_22 = () => {', '  if (true) {', '    return true;', '  } else {', '      return false;', '  }', '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  // describe('Class Test', () => {
  //   it('Should properly generate a class', (done) => {
  //     test = {
  //       argFile: 'class',
  //       expected: {
  //         output: [''],
  //         numLogs: 1,
  //       },
  //     };
  //     jsGenTest(test);
  //     done();
  //   });
  // });


  describe('List Literal Test', () => {
    it('Should properly generate list literals', (done) => {
      test = {
        argFile: 'list',
        expected: {
          output: [
            'let a_23 = [];',
            'let b_24 = [1, 2, 3, 4, 5];',
            'b_24.forEach((x_25) => {',
            '  if ((x_25 > 1)) {',
            '    print_1(x_25);',
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
          output: ['let a_26 = [(BinExp x + 2) for x in [1, 2, 3]];'],
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
          output: ['let a_27 = [(BinExp 1 + 4), (BinExp 8 - 2), (BinExp 5 * 5), (BinExp 9 / 3)];'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });
});
