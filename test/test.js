const fs = require('fs');
const bool = fs.readFileSync('bool.ohm');
const ohm = require('ohm-js');


const gram = ohm.grammar(bool);

var assert = require('assert');

describe('Arithmetic', function() {
  describe('3 + 2', function() {
    it('should succeed', function() {
      let match = gram.match('2 + 3');
      assert.ok(match.succeeded());
    });
  });
});
