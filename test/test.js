/* eslint-env node, mocha */

const fs = require('fs');
const ohm = require('ohm-js');
const assert = require('assert');
const parse = require('../parser.js');
const bool = fs.readFileSync('bool.ohm');
const gram = ohm.grammar(bool);

describe('Grammar tests (all have trailing newline)', () => {
  describe('Arithmetic', () => {
    describe('3 + 2', () => {
      it('should be equivalent to result', () => {
        const match = gram.match('2 + 3 \n');
        assert.ok(match.succeeded());
      });
    });
    describe('8 * 8', () => {
      it('should be equivalent to result', () => {
        const match = gram.match('8 * 8 \n');
        assert.ok(match.succeeded());
      });
    });
    describe('8 % 2', () => {
      it('should be equivalent to result', () => {
        const match = gram.match('8 % 2 \n');
        assert.ok(match.succeeded());
      });
    });
    describe('x > y', () => {
      it('should be equivalent to result', () => {
        const match = gram.match('x > y \n');
        assert.ok(match.succeeded());
      });
    });
    describe('!x', () => {
      it('should not be equivalent to result', () => {
        const match = gram.match('!x \n');
        assert.ok(match.succeeded());
      });
    });
  });

  describe('Lists', () => {
    describe('[1, 2, 3]', () => {
      it('should be equivalent to list', () => {
        const match = gram.match('[1, 2, 3] \n');
        assert.ok(match.succeeded());
      });
    });
    describe('[ 4, 5, 6 ]', () => {
      it('should allow extra spaces', () => {
        const match = gram.match('[ 4, 5, 6 ] \n');
        assert.ok(match.succeeded());
      });
    });
  });

  describe('Functions', () => {
    describe('fun a(): \n indent 3 + 2 \n dedent', () => {
      it('should succeed on empty block', () => {
        const match = gram.match('fun a(): \n indent 3 + 2 \n dedent \n');
        assert.ok(match.succeeded());
      });
    });

    describe('fun a(): \n indent ret 3 + 2 \n dedent', () => {
      it('should succeed on normal block', () => {
        const match = gram.match('fun a(): \n indent ret 3 + 2 \n dedent \n');
        assert.ok(match.succeeded());
      });
    });

    describe('fun a(x y): \n indent ret 3 + x \n dedent \n', () => {
      it('should succeed on parameters', () => {
        const match = gram.match('fun a(x y): \n indent ret 3 + x \n dedent \n');
        assert.ok(match.succeeded());
      });
    });

    describe('(x y): \n indent ret 3 + x - y \n dedent \n', () => {
      it('should succeed on function literal', () => {
        const match = gram.match('(x y): \n indent ret 3 + x \n dedent \n');
        assert.ok(match.succeeded());
      });
    });

    describe('(x y): \n indent z = y \n ret 3 + x - y \n dedent \n', () => {
      it('should succeed on function literal (multiple expressions)', () => {
        const match = gram.match('(x y): \n indent z = y \n ret 3 + x \n dedent \n');
        assert.ok(match.succeeded());
      });
    });
  });

  describe('Objects', () => {
    describe('x := \n indent dedent', () => {
      it('should succeed on empty object', () => {
        const match = gram.match('x := \n indent dedent \n');
        assert.ok(match.succeeded());
      });
    });

    describe('x := \n indent a: \n indent b \n dedent \n dedent', () => {
      it('should succeed on normal object', () => {
        const match = gram.match('x := \n indent a: b \n dedent \n');
        assert.ok(match.succeeded());
      });
    });

    describe('{ \n indent a: indent b \n dedent dedent }', () => {
      it('should succeed on object literal', () => {
        const match = gram.match('{ \n indent a: b \n dedent } \n');
        assert.ok(match.succeeded());
      });
    });
  });

  describe('Classes', () => {
    describe('class Person: \n indent _name \n maker(_name): \n indent ret _name \n dedent dedent \n', () => {
      it('should succeed on class dec with one field', () => {
        const match = gram.match('class Person: \n indent _name \n maker(_name): \n indent ret _name \n dedent dedent \n');
        assert.ok(match.succeeded());
      });
    });
  });
});

describe('Parser Tests', () => {
  describe('Literal Tests', () => {
    const prog = parse('1234 \n');
    console.log(prog);
  });
});
