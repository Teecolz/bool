/* eslint-env node, mocha */

const fs = require('fs');
const ohm = require('ohm-js');
const assert = require('assert');
const parse = require('../parser.js');
const sinon = require('sinon');
require('../generator.js');

const bool = fs.readFileSync('bool.ohm');
const gram = ohm.grammar(bool);
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
    // assert.equal(console.log.args.length, expectedOut.length);
  console.log.args.forEach((arg, index) => {
    assert.deepEqual(arg[0], expectedOut[index]);
  });
};

let test;

describe('Generator Tests', () => {
  beforeEach(() => {
    sinon.stub(console, 'log').returns(void 0);
    sinon.stub(console, 'error').returns(void 0);
  });
  afterEach(() => {
    console.log.restore();
    console.error.restore();
  });

  describe('Hello World Test', () => {
    it('Should propery generate "Hello, world!""', (done) => {
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
    it('Should propery generate a basic function', (done) => {
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

    it('Should propery generate a function with params', (done) => {
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
    it('Should propery generate a basic function', (done) => {
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
    it('Should propery generate an if statement', (done) => {
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
    it('Should propery generate a normal statement with a string', (done) => {
      test = {
        argFile: 'stmt',
        expected: {
          output: ['let x_8 = \'test\';', '};'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

    // describe('Object Test', () => {
    //     it('Should propery generate an object', (done) => {
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
    it('Should propery generate a range expression', (done) => {
      test = {
        argFile: 'range',
        expected: {
          output: ['for (let x_18 = 0; x_18 < 1; x_18 += 1) {', '  return true;', '}'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });

  describe('While & Unary Expression Test', () => {
    it('Should propery generate a while statement', (done) => {
      test = {
        argFile: 'while',
        expected: {
          output: ['while (true) {', '  return false;', '}'],
          numLogs: 1,
        },
      };
      jsGenTest(test);
      done();
    });
  });
});
