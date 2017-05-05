/* eslint-env node, mocha */
/* eslint no-void: 0 */
const fs = require('fs');
const assert = require('assert');
const parse = require('../syntax/parser.js');
const sinon = require('sinon');
require('../backend/generator.js');
const resetJsName = require('../backend/generator.js').resetJsName;

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
const optimizeTest = (fNamePrefix) => {
  const jsCode = parse(fs.readFileSync(`test/data/optimizer/input/${fNamePrefix}.bool`, {
    encoding: 'UTF-8',
  }));
  let expectedOut = fs.readFileSync(`test/data/optimizer/output/${fNamePrefix}.js`, {
    encoding: 'UTF-8',
  }).toString().replace(/(_\d+)|(__\w+)/g, nameParser).split('\n');
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
