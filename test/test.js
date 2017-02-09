const fs = require('fs');
const bool = fs.readFileSync('bool.ohm');
const ohm = require('ohm-js');


const gram = ohm.grammar(bool);

let match = gram.match('2 + 3');

if (match.succeeded()) {
    console.log('Simple Arithmetic Match');
}

var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
