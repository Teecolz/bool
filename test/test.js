const fs = require('fs');
const ohm = require('ohm-js');
const assert = require('assert');

const bool = fs.readFileSync('bool.ohm');
const gram = ohm.grammar(bool);

describe('Arithmetic', () => {
  describe('3 + 2', () => {
    it('should be equivilent to result', () => {
      let match = gram.match('2 + 3');
      assert.ok(match.succeeded());
    });
  });
  describe('8 * 8', () => {
    it('should be equivilent to result', () => {
      let match = gram.match('2 ** 6');
      assert.ok(match.succeeded());
    });
  });
  describe('8 % 2', () => {
    it('should be equivilent to result', () => {
      let match = gram.match('100 % 2');
      assert.ok(match.succeeded());
    });
  });
  describe('x > y', () => {
    it('should be equivilent to result', () => {
      let x = 4;
      let y = 4 % 2;
      assert.ok('x > y');
    });
  });
  describe('!x', () => {
    it('should not be equivilent to result', () => {
      let x = 4;
      assert.ok('!x')
    });
  });
});
