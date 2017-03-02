/* eslint-env node, mocha */

/*
 * TODO: ClassDecls, ObjDecls,
 * Object Access, ClassInst, FunCalls
*/

const fs = require('fs');
const ohm = require('ohm-js');
const assert = require('assert');
const parse = require('../parser.js');

const bool = fs.readFileSync('bool.ohm');
const gram = ohm.grammar(bool);

const parseTest = (arg, expected) => {
  const ast = parse(arg).toString();
  assert.deepEqual(ast, expected);
};

let tests;

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
  describe('Legal Literal Tests', () => {
    tests = [
      {
        arg: '1234\n',
        expected: '(Program (Block 1234))',
      },
      {
        arg: '1234.\n',
        expected: '(Program (Block 1234.))',
      },
      {
        arg: '1234.1\n',
        expected: '(Program (Block 1234.1))',
      },
      {
        arg: '.1\n',
        expected: '(Program (Block .1))',
      },
      {
        arg: '"hello 1"\n',
        expected: '(Program (Block "hello 1"))',
      },
      {
        arg: 'tru\n',
        expected: '(Program (Block tru))',
      },
      {
        arg: 'fal\n',
        expected: '(Program (Block fal))',
      },
      {
        arg: '[]\n',
        expected: '(Program (Block []))',
      },
      {
        arg: '[1.2] \n',
        expected: '(Program (Block [1.2]))',
      },
      {
        arg: '[a] \n',
        expected: '(Program (Block [a]))',
      },
      {
        arg: '[a, b] \n',
        expected: '(Program (Block [a, b]))',
      },
      {
        arg: '[ a, b ] \n',
        expected: '(Program (Block [a, b]))',
      },
      {
        arg: '[ a, [a] ] \n',
        expected: '(Program (Block [a, [a]]))',
      },
      {
        arg: '[1, 2]\n',
        expected: '(Program (Block [1, 2]))',
      },
      {
        arg: '[ 1, 2 ]\n',
        expected: '(Program (Block [1, 2]))',
      },
      {
        arg: '{}\n',
        expected: '(Program (Block (Objlit {})))',
      },
      {
        arg: '{ a : 1 }\n',
        expected: '(Program (Block (Objlit {(PropDecl a : 1)})))',
      },
      {
        arg: '{ a : b }\n',
        expected: '(Program (Block (Objlit {(PropDecl a : b)})))',
      },
      {
        arg: '{\n indent a: b\n dedent}\n',
        expected: '(Program (Block (Objlit {(PropDecl a : b)})))',
      },
      {
        arg: '{\n indent a: b\n c: d\n dedent}\n',
        expected: '(Program (Block (Objlit {(PropDecl a : b), (PropDecl c : d)})))',
      },
      {
        arg: '():\n indent ret "Hello, world" \n dedent \n',
        expected: '(Program (Block (Funlit (Params ) : (Suite (Return "Hello, world")))))',
      },
      {
        arg: '(a):\n indent ret a + 2\n dedent\n',
        expected: '(Program (Block (Funlit (Params a) : (Suite (Return (BinExp a + 2))))))',
      },
      {
        arg: '(a b):\n indent b = a + b\n ret b\n dedent\n',
        expected: '(Program (Block (Funlit (Params a,b) : (Suite (VarDecl b = (BinExp a + b)), (Return b)))))',
      },
    ];

    tests.forEach((test) => {
      it(`correctly parses \n ${test.arg.trim()}`, () => {
        parseTest(test.arg, test.expected);
      });
    });
  });

  describe('Conditional Tests', () => {
    describe('Simple Ifs', () => {
      tests = [
        {
          arg: 'if tru:\n indent ret 1\n dedent\n',
          expected: '(Case tru, (Suite (Return 1)))',
        },
        {
          arg: 'if tru :\n indent ret 1\n dedent\n',
          expected: '(Case tru, (Suite (Return 1)))',
        },
        {
          arg: 'if a + b :\n indent [1, 2, 3]\n dedent\n',
          expected: '(Case (BinExp a + b), (Suite [1, 2, 3]))',
        },
        {
          arg: 'if a + b :\n indent x = [1, 2, 3]\n ret x\n dedent\n',
          expected: '(Case (BinExp a + b), (Suite (VarDecl x = [1, 2, 3]), (Return x)))',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, `(Program (Block (Conditional ${test.expected})))`);
        });
      });
    });

    describe('If-Elif Statements', () => {
      tests = [
        {
          arg:
            'if tru:\n indent ret 1\n dedent' +
            'elif a + b :\n indent [1, 2, 3]\n dedent\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite [1, 2, 3]))',
        },
        {
          arg:
            'if tru:\n indent ret 1\n dedent' +
            'elif a + b :\n indent x = [1, 2, 3]\n ret x\n dedent\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite (VarDecl x = [1, 2, 3]), (Return x)))',
        },
        {
          arg:
            'if tru:\n indent ret 1\n dedent' +
            'elif a + b :\n indent x = [1, 2, 3]\n ret x\n dedent' +
            'elif a and b :\n indent x = (2 ** 3)\n ret x\n dedent\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite (VarDecl x = [1, 2, 3]), (Return x))), ' +
            '(Case (BinExp a and b), (Suite (VarDecl x = (Parens (BinExp 2 ** 3))), (Return x)))',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, `(Program (Block (Conditional ${test.expected})))`);
        });
      });
    });

    describe('El Statements', () => {
      tests = [
        {
          arg:
            'if tru:\n indent ret 1\n dedent' +
            'el:\n indent [1, 2, 3]\n dedent\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Suite [1, 2, 3])',
        },
        {
          arg:
            'if tru:\n indent ret 1\n dedent' +
            'elif a + b :\n indent x = [1, 2, 3]\n ret x\n dedent' +
            'el:\n indent ret fal\n dedent\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite (VarDecl x = [1, 2, 3]), (Return x))), ' +
            '(Suite (Return fal))',
        },
        {
          arg:
            'if tru:\n indent ret 1\n dedent' +
            'elif a + b :\n indent x = [1, 2, 3]\n ret x\n dedent' +
            'el:\n indent x = (2 ** 3)\n ret x\n dedent\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite (VarDecl x = [1, 2, 3]), (Return x))), ' +
            '(Suite (VarDecl x = (Parens (BinExp 2 ** 3))), (Return x))',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, `(Program (Block (Conditional ${test.expected})))`);
        });
      });
    });
  });

  describe('Comments', () => {
    tests = [
      {
        arg: '# This is a comment\n',
        expected: '',
      },
      {
        arg: '1 + 2 ## This comment follows an expression ##\n',
        expected: '(BinExp 1 + 2)',
      },
      {
        arg: '## This \n comment \n has multiple \n lines ##',
        expected: '',
      },
      {
        arg: '## This \n comment \n has multiple \n lines ## [1, 2, 3]\n',
        expected: '[1, 2, 3]',
      },
    ];

    tests.forEach((test) => {
      it(`correctly parses \n ${test.arg.trim()}`, () => {
        parseTest(test.arg, `(Program (Block ${test.expected}))`);
      });
    });
  });

  describe('Function Tests', () => {
    describe('Declarations', () => {
      tests = [
        {
          arg: 'fun x():\n indent ret x\n dedent\n',
          expected: '(Function x (Params ) : (Suite (Return x)))',
        },
        {
          arg: 'fun x ():\n indent ret x\n dedent\n',
          expected: '(Function x (Params ) : (Suite (Return x)))',
        },
        {
          arg: 'fun x () :\n indent ret x\n dedent\n',
          expected: '(Function x (Params ) : (Suite (Return x)))',
        },
        {
          arg: 'fun x (a b):\n indent ret x + (a + b)\n dedent\n',
          expected: '(Function x (Params a,b) : (Suite (Return (BinExp x + (Parens (BinExp a + b))))))',
        },
        {
          arg: 'fun foo(x y z):\n indent ret tru\n dedent\n',
          expected: '(Function foo (Params x,y,z) : (Suite (Return tru)))',
        },
        {
          arg: 'fun bar(x y z a b c):\n indent ret x + y > z ** b\n dedent\n',
          expected: '(Function bar (Params x,y,z,a,b,c) : ' +
               '(Suite (Return (BinExp (BinExp x + y) > (BinExp z ** b)))))',
        },
        {
          arg: 'fun blah(x):\n indent ret x + 1\n dedent\n',
          expected: '(Function blah (Params x) : (Suite (Return (BinExp x + 1))))',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, `(Program (Block ${test.expected}))`);
        });
      });
    });

    describe('Call tests', () => {
      tests = [
        {
          arg: 'x()\n',
          expected: '(FunCall x (Params ))',
        },
        {
          arg: 'x ()\n',
          expected: '(FunCall x (Params ))',
        },
        {
          arg: 'x ()()\n',
          expected: '(FunCall x (Params ), (Params ))',
        },
        {
          arg: 'x (a)(b)\n',
          expected: '(FunCall x (Params a), (Params b))',
        },
        {
          arg: 'x (a)("b")\n',
          expected: '(FunCall x (Params a), (Params "b"))',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, `(Program (Block ${test.expected}))`);
        });
      });
    });
  });

  describe('Arithmetic Tests', () => {
    tests = [
      {
        arg: '1 + 2\n',
        expected: '(Program (Block (BinExp 1 + 2)))',
      },
      {
        arg: '90 % 9\n',
        expected: '(Program (Block (BinExp 90 % 9)))',
      },
      {
        arg: '9 ** 9\n',
        expected: '(Program (Block (BinExp 9 ** 9)))',
      },
      {
        arg: '3 ** 2 + 7\n',
        expected: '(Program (Block (BinExp (BinExp 3 ** 2) + 7)))',
      },
      {
        arg: '6 / 2\n',
        expected: '(Program (Block (BinExp 6 / 2)))',
      },
      {
        arg: '2 + 5\n - 2 + 42\n',
        expected: '(Program (Block (BinExp 2 + 5), (BinExp (UnExp - 2) + 42)))',
      },
    ];

    tests.forEach((test) => {
      it(`correctly parses \n ${test.arg.trim()}`, () => {
        parseTest(test.arg, test.expected);
      });
    });
  });

  describe('Loop Tests', () => {
    tests = [
      {
        arg: 'while x == 1:\n indent ret 1\n dedent\n',
        expected: '(Program (Block (while (BinExp x == 1) (Suite (Return 1)))))',
      },
      {
        arg: 'for x in y:\n indent ret 1\n dedent\n',
        expected: '(Program (Block (for x y (Suite (Return 1)))))',
      },
      {
        arg: 'for x in [1,2,3]:\n indent ret tru\n dedent\n',
        expected: '(Program (Block (for x [1, 2, 3] (Suite (Return tru)))))',
      },
    ];

    tests.forEach((test) => {
      it(`correctly parses \n ${test.arg.trim()}`, () => {
        parseTest(test.arg, test.expected);
      });
    });
  });
});
