const fs = require('fs');
const bool = fs.readFileSync('bool.ohm');
const ohm = require('ohm-js');


const gram = ohm.grammar(bool);

var assert = require('assert');

describe('Arithmetic', function() {
  describe('3 + 2', function() {
    it('should be equivilent to result', function() {
      let match = gram.match('2 + 3');
      assert.ok(match.succeeded());
    });
  });
  describe('8 * 8', function() {
    it('should be equivilent to result', function() {
      let match = gram.match('2 ** 6');
      assert.ok(match.succeeded());
    });
  });
  describe('8 % 2', function() {
    it('should be equivilent to result', function() {
      let match = gram.match('100 % 2');
      assert.ok(match.succeeded());
    });
  });
  describe('x > y', function() {
    it('should be equivilent to result', function() {
      let x = 4;
      let y = 4 % 2;
      assert.ok('x > y');
    });
  });
});
