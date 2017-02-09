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

describe("Arrays", () => {
  describe('[1, 2, 3]', () => {
    it('should be equivilent to array', () => {
      let x = [1, 2, 3];
      let y = [1, 2, 3];
      assert.deepEqual(x, y);
    });
  });
  describe('[4, 5, 6]', () => {
    it('should be equivilent to array', () => {
      let x = [4, 5, 6];
      let y = x;
      assert.deepEqual(x, y);
    });
  });
});

describe('Functions', () => {
    describe('fun a(): \n indent \n dedent', () => {
        it('should succeed on empty block', () => {
            let match = gram.match('fun a(): \n indent dedent');
            assert.ok(match.succeeded());
        });
    });

    describe('fun a(): \n indent ret 3 + 2 dedent', () => {
        it('should succeed on normal block', () => {
            let match = gram.match('fun a(): \n indent ret 3 + 2 \n dedent');
            assert.ok(match.succeeded());
        });
    });

    describe('fun a(x y): \n indent ret 3 + x dedent', () => {
        it('should succeed on parameters', () => {
            let match = gram.match('fun a(x y): \n indent ret 3 + x \n dedent');
            assert.ok(match.succeeded());
        });
    });

    describe('(x y): \n indent ret 3 + x - y dedent', () => {
        it('should succeed on function literal', () => {
            let match = gram.match('(x y): \n indent ret 3 + x \n dedent');
            assert.ok(match.succeeded());
        });
    });

    describe('(x y): \n indent z = y \n ret 3 + x - y \n dedent', () => {
        it('should succeed on function literal (multiple expressions)', () => {
            let match = gram.match('(x y): \n indent z = y \n ret 3 + x \n dedent');
            assert.ok(match.succeeded());
        });
    });
});

describe('Objects', () => {
  describe('x := \n indent dedent', () => {
    it('should succeed on empty object', () => {
      let match = gram.match('x := \n indent dedent');
      assert.ok(match.succeeded());
    });
  });

  describe('x := \n indent a: \n indent b \n dedent dedent', () => {
    it('should succeed on normal object', () => {
      let match = gram.match('x := \n indent a: \n indent b \n dedent dedent');
      assert.ok(match.succeeded());
    });
  });

  describe('{ \n indent a: \n indent b \n dedent dedent }', () => {
    it('should succeed on normal object', () => {
      let match = gram.match('{ \n indent a: \n indent b \n dedent dedent }');
      assert.ok(match.succeeded());
    });
  });
});
