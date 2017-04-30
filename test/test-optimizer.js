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

const optimizeTest = (fNamePrefix) => {
  const jsCode = parse(fs.readFileSync(`test/data/optimizer/input/${fNamePrefix}.bool`, {
    encoding: 'UTF-8',
  }));
  let expectedOut = fs.readFileSync(`test/data/optimizer/output/${fNamePrefix}.js`, {
    encoding: 'UTF-8',
  }).toString().split('\n');
  // have to get rid of trailing newline and eslint comment
  expectedOut = expectedOut.slice(1, expectedOut.length - 1);
  jsCode.analyze();
  jsCode.optimize();
  jsCode.gen();
  expectedOut = LIBRARY_FUNCTIONS.concat(expectedOut);
  assert.ok(console.log.called, 'log should have been called.');
  assert.equal(console.log.args.length, expectedOut.length);
  console.log.args.forEach((arg, index) => {
    assert.deepEqual(arg[0], expectedOut[index]);
  });
};

describe('Optimizer Tests', () => {
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

  describe('Constant Folding', () => {
    it('Should fold integers', (done) => {
      optimizeTest('integer-binexps');
      done();
    });
    it('Should fold booleans', (done) => {
      optimizeTest('boolean-binexps');
      done();
    });
    it('Should fold floats', (done) => {
      optimizeTest('float-binexps');
      done();
    });
    it('Should fold strings', (done) => {
      optimizeTest('string-binexps');
      done();
    });
  });
});
