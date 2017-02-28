/* eslint-env node, mocha */

const fs = require('fs');
const ohm = require('ohm-js');
const assert = require('assert');

const bool = fs.readFileSync('bool.ohm');
const gram = ohm.grammar(bool);


describe('Arithmetic', () => {
  describe('3 + 2', () => {
    it('should be equivalent to result', () => {
      const match = gram.match('2 + 3');
      assert.ok(match.succeeded());
    });
  });
  describe('8 * 8', () => {
    it('should be equivalent to result', () => {
      const match = gram.match('8 * 8');
      assert.ok(match.succeeded());
    });
  });
  describe('8 % 2', () => {
    it('should be equivalent to result', () => {
      const match = gram.match('8 % 2');
      assert.ok(match.succeeded());
    });
  });
  describe('x > y', () => {
    it('should be equivalent to result', () => {
      const match = gram.match('x > y');
      assert.ok(match.succeeded());
    });
  });
  describe('!x', () => {
    it('should not be equivalent to result', () => {
      const match = gram.match('!x');
      assert.ok(match.succeeded());
    });
  });
});

describe('Lists', () => {
  describe('[1, 2, 3]', () => {
    it('should be equivalent to list', () => {
      const match = gram.match('[1, 2, 3]');
      assert.ok(match.succeeded());
    });
  });
  describe('[ 4, 5, 6 ]', () => {
    it('should allow extra spaces', () => {
      const match = gram.match('[ 4, 5, 6 ]');
      assert.ok(match.succeeded());
    });
  });
});

describe('Functions', () => {
  describe('fun a(): \n indent \n dedent', () => {
    it('should succeed on empty block', () => {
      const match = gram.match('fun a(): \n indent dedent');
      assert.ok(match.succeeded());
    });
  });

  describe('fun a(): \n indent ret 3 + 2 dedent', () => {
    it('should succeed on normal block', () => {
      const match = gram.match('fun a(): \n indent ret 3 + 2 \n dedent');
      assert.ok(match.succeeded());
    });
  });

  describe('fun a(x y): \n indent ret 3 + x dedent', () => {
    it('should succeed on parameters', () => {
      const match = gram.match('fun a(x y): \n indent ret 3 + x \n dedent');
      assert.ok(match.succeeded());
    });
  });

  describe('(x y): \n indent ret 3 + x - y dedent', () => {
    it('should succeed on function literal', () => {
      const match = gram.match('(x y): \n indent ret 3 + x \n dedent');
      assert.ok(match.succeeded());
    });
  });

  describe('(x y): \n indent z = y \n ret 3 + x - y \n dedent', () => {
    it('should succeed on function literal (multiple expressions)', () => {
      const match = gram.match('(x y): \n indent z = y \n ret 3 + x \n dedent');
      assert.ok(match.succeeded());
    });
  });
});

describe('Objects', () => {
  describe('x := \n indent dedent', () => {
    it('should succeed on empty object', () => {
      const match = gram.match('x := \n indent dedent');
      assert.ok(match.succeeded());
    });
  });

  describe('x := \n indent a: \n indent b \n dedent dedent', () => {
    it('should succeed on normal object', () => {
      const match = gram.match('x := \n indent a: \n indent b \n dedent dedent');
      assert.ok(match.succeeded());
    });
  });

  describe('{ \n indent a: \n indent b \n dedent dedent }', () => {
    it('should succeed on object literal', () => {
      const match = gram.match('{ \n indent a: \n indent b \n dedent dedent }');
      assert.ok(match.succeeded());
    });
  });
});

describe('Classes', () => {
  describe('class Person: \n indent _field \n maker(_field): \n indent ret "Hello, World" \n dedent \n dedent', () => {
    it('should succeed on class dec with one field', () => {
      const match = gram.match('class Person: \n indent _field \n maker(_field): \n indent ret "Hello World" \n dedent \n dedent');
      assert.ok(match.succeeded());
    });
  });
});
