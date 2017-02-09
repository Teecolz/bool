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

describe('Functions', function() {
    describe('fun a(): \n indent \n dedent', function() {
        it('should succeed on empty block', function() {
            let match = gram.match('fun a(): \n indent dedent');
            assert.ok(match.succeeded());
        });
    });

    describe('fun a(): \n indent ret 3 + 2 dedent', function() {
        it('should succeed on normal block', function() {
            let match = gram.match('fun a(): \n indent ret 3 + 2 \n dedent');
            assert.ok(match.succeeded());
        });
    });

    describe('fun a(x y): \n indent ret 3 + x dedent', function() {
        it('should succeed on parameters', function() {
            let match = gram.match('fun a(x y): \n indent ret 3 + x \n dedent');
            assert.ok(match.succeeded());
        });
    });

    describe('(x y): \n indent ret 3 + x - y dedent', function() {
        it('should succeed on function literal', function() {
            let match = gram.match('(x y): \n indent ret 3 + x \n dedent');
            assert.ok(match.succeeded());
        });
    });

    describe('(x y): \n indent z = y \n ret 3 + x - y \n dedent', function() {
        it('should succeed on function literal (multiple expressions)', function() {
            let match = gram.match('(x y): \n indent z = y \n ret 3 + x \n dedent');
            assert.ok(match.succeeded());
        });
    });
});
