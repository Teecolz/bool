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
  const jsCode = parse(fs.readFileSync(`test/data/generator/${testDatum.argFile}.bool`, { encoding: 'UTF-8' }));
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
  beforeEach(() => {
    sinon.stub(console, 'log').returns(void 0);
    sinon.stub(console, 'error').returns(void 0);
  });
  afterEach(() => {
    console.log.restore();
    console.error.restore();
  });

  describe('Hello World Test', () => {
    test = {
      argFile: 'helloworld',
      expected: { output: ['print_1("Hello, world!");'], numLogs: 1 },
    };

    it('Should propery generate "Hello, world!""', () => {
      jsGenTest(test);
    });
  });
});
