/* eslint-env node, mocha */

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
    describe('fun a(): \n ⇨ 3 + 2 \n ⇦', () => {
      it('should succeed on empty block', () => {
        const match = gram.match('fun a(): \n ⇨ 3 + 2 \n ⇦ \n');
        assert.ok(match.succeeded());
      });
    });

    describe('fun a(): \n ⇨ ret 3 + 2 \n ⇦', () => {
      it('should succeed on normal block', () => {
        const match = gram.match('fun a(): \n ⇨ ret 3 + 2 \n ⇦ \n');
        assert.ok(match.succeeded());
      });
    });

    describe('fun a(x y): \n ⇨ ret 3 + x \n ⇦ \n', () => {
      it('should succeed on parameters', () => {
        const match = gram.match('fun a(x y): \n ⇨ ret 3 + x \n ⇦ \n');
        assert.ok(match.succeeded());
      });
    });

    describe('~((x y):\n⇨ret 3 + x - y\n⇦)\n', () => {
      it('should succeed on function literal', () => {
        const match = gram.match('~((x y):\n⇨ret (3 + (x - y))\n⇦)\n');
        assert.ok(match.succeeded());
      });
    });

    describe('~((x y):\n⇨z = y\nret 3 + x - y\n⇦)\n', () => {
      it('should succeed on function literal (multiple expressions)', () => {
        const match = gram.match('~((x y):\n⇨z = y\nret (3 + (x - y))\n⇦)\n');
        assert.ok(match.succeeded());
      });
    });
  });

  describe('Objects', () => {
    describe('x := \n ⇨ ⇦', () => {
      it('should fail on empty object', () => {
        const match = gram.match('x := \n ⇨ ⇦ \n');
        assert.ok(!match.succeeded());
      });
    });

    describe('x := \n ⇨ a: \n ⇨ b \n ⇦ \n ⇦', () => {
      it('should succeed on normal object', () => {
        const match = gram.match('x := \n ⇨ a: b \n ⇦ \n');
        assert.ok(match.succeeded());
      });
    });

    describe('{ \n ⇨ a: ⇨ b \n ⇦ ⇦ }', () => {
      it('should succeed on object literal', () => {
        const match = gram.match('{ \n ⇨ a: b \n ⇦ } \n');
        assert.ok(match.succeeded());
      });
    });
  });

  describe('Classes', () => {
    describe('class Person: \n ⇨build(_name)\n⇦\n', () => {
      it('should succeed on class dec with one field', () => {
        const match = gram.match('class Person: \n ⇨build(_name)\n⇦\n');
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
        arg: 'let x:[int] = [2, 3] \n',
        expected: '(Program (Block (VarDecl x:[int] = [2, 3])))',
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
        arg: '[ x for x in y ]\n',
        expected: '(Program (Block [x for x in y]))',
      },
      {
        arg: '[ x + 2 for x in [1, 2, 3]]\n',
        expected: '(Program (Block [(BinExp x + 2) for x in [1, 2, 3]]))',
      },
      {
        arg: '[ x + 2 for x in [1, 2, 3] if x !== 1]\n',
        expected: '(Program (Block [(BinExp x + 2) for x in [1, 2, 3] (If (BinExp x !== 1))]))',
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
        arg: '{\n  a: b\n}\n',
        expected: '(Program (Block (Objlit {(PropDecl a : b)})))',
      },
      {
        arg: '{\n  a: b\n  c: d\n}\n',
        expected: '(Program (Block (Objlit {(PropDecl a : b), (PropDecl c : d)})))',
      },
      {
        arg: '~((): "Hello, world")\n',
        expected: '(Program (Block (Funlit (Params ) : "Hello, world")))',
      },
      {
        arg: '~((): "Hello, world")\n',
        expected: '(Program (Block (Funlit (Params ) : "Hello, world")))',
      },
      {
        arg: '~((a): (a + 2))\n',
        expected: '(Program (Block (Funlit (Params a) : (BinExp a + 2))))',
      },
      {
        arg: '~((a b):\n⇨let b = a + b\nret b\n⇦)\n',
        expected: '(Program (Block (Funlit (Params a,b) : (Suite (VarDecl b:<no type> = (BinExp a + b)), (Return b)))))',
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
          arg: 'if tru:\n  ret 1\n',
          expected: '(Case tru, (Suite (Return 1)))',
        },
        {
          arg: 'if tru :\n  ret 1\n',
          expected: '(Case tru, (Suite (Return 1)))',
        },
        {
          arg: 'if a + b :\n  [1, 2, 3]\n',
          expected: '(Case (BinExp a + b), (Suite [1, 2, 3]))',
        },
        {
          arg: 'if a + b :\n  let x = [1, 2, 3]\n  ret x\n',
          expected: '(Case (BinExp a + b), (Suite (VarDecl x:<no type> = [1, 2, 3]), (Return x)))',
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
            'if tru:\n  ret 1\n' +
            'elif a + b :\n  [1, 2, 3]\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite [1, 2, 3]))',
        },
        {
          arg:
            'if tru:\n  ret 1\n' +
            'elif a + b :\n  let x:[int] = [1, 2, 3]\n  ret x\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite (VarDecl x:[int] = [1, 2, 3]), (Return x)))',
        },
        {
          arg:
            'if tru:\n  ret 1\n' +
            'elif a + b :\n  let x = [1, 2, 3]\n  ret x\n' +
            'elif a > b :\n  a = (2 ** 3)\n  ret a\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite (VarDecl x:<no type> = [1, 2, 3]), (Return x))), ' +
            '(Case (BinExp a > b), (Suite (= a (BinExp 2 ** 3)), (Return a)))',
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
            'if tru:\n  ret 1\n' +
            'el:\n  [1, 2, 3]\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Suite [1, 2, 3])',
        },
        {
          arg:
            'if tru:\n  ret 1\n' +
            'elif a + b :\n  let x = [1, 2, 3]\n  ret x\n' +
            'el:\n  ret fal\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite (VarDecl x:<no type> = [1, 2, 3]), (Return x))), ' +
            '(Suite (Return fal))',
        },
        {
          arg:
            'if tru:\n  ret 1\n' +
            'elif a + b :\n  let x = [1, 2, 3]\n  ret x\n' +
            'el:\n  let x:int = (2 ** 3)\n  ret x\n',
          expected:
            '(Case tru, (Suite (Return 1))), ' +
            '(Case (BinExp a + b), (Suite (VarDecl x:<no type> = [1, 2, 3]), (Return x))), ' +
            '(Suite (VarDecl x:int = (BinExp 2 ** 3)), (Return x))',
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
        arg: '## This\ncomment\nhas multiple\nlines ##\n',
        expected: '',
      },
      {
        arg: '## This\ncomment\nhas multiple\nlines ## [1, 2, 3]\n',
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
          arg: 'fun x():\n  ret x\n',
          expected: '(Function x (Params ) : (Suite (Return x)))',
        },
        {
          arg: 'fun x ():\n ret x\n',
          expected: '(Function x (Params ) : (Suite (Return x)))',
        },
        {
          arg: 'fun x () :\n  ret x\n',
          expected: '(Function x (Params ) : (Suite (Return x)))',
        },
        {
          arg: 'fun x (a b):\n  ret x + (a + b)\n',
          expected: '(Function x (Params a,b) : (Suite (Return (BinExp x + (BinExp a + b)))))',
        },
        {
          arg: 'fun foo(x y z):\n  ret tru\n',
          expected: '(Function foo (Params x,y,z) : (Suite (Return tru)))',
        },
        {
          arg: 'fun bar(x y z a b c):\n  ret x + y > z ** b\n',
          expected: '(Function bar (Params x,y,z,a,b,c) : ' +
               '(Suite (Return (BinExp (BinExp x + y) > (BinExp z ** b)))))',
        },
        {
          arg: 'fun blah(x):\n  ret x + 1\n',
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
          expected: '(FunCall x (FunParams ))',
        },
        {
          arg: 'x ()\n',
          expected: '(FunCall x (FunParams ))',
        },
        {
          arg: 'x ()()\n',
          expected: '(FunCall x (FunParams ), (FunParams ))',
        },
        {
          arg: 'x (a)(b)\n',
          expected: '(FunCall x (FunParams a), (FunParams b))',
        },
        {
          arg: 'x (a)("b")\n',
          expected: '(FunCall x (FunParams a), (FunParams "b"))',
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
        arg: '2 + 5\n-2 + 42\n',
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
        arg: 'while x == 1:\n  ret 1\n',
        expected: '(Program (Block (while (BinExp x == 1) (Suite (Return 1)))))',
      },
      {
        arg: 'for x in y:\n  ret 1\n',
        expected: '(Program (Block (for x in y : (Suite (Return 1)))))',
      },
      {
        arg: 'for x in [1,2,3]:\n  ret tru\n',
        expected: '(Program (Block (for x in [1, 2, 3] : (Suite (Return tru)))))',
      },
      {
        arg: 'for x in range(1):\n  ret tru\n',
        expected: '(Program (Block (for x in (Range 0, 1, 1) : (Suite (Return tru)))))',
      },
      {
        arg: 'for x in range(1, 2):\n  ret tru\n',
        expected: '(Program (Block (for x in (Range 1, 2, 1) : (Suite (Return tru)))))',
      },
      {
        arg: 'for x in range(1, 2, 3):\n  ret tru\n',
        expected: '(Program (Block (for x in (Range 1, 2, 3) : (Suite (Return tru)))))',
      },
    ];

    tests.forEach((test) => {
      it(`correctly parses \n ${test.arg.trim()}`, () => {
        parseTest(test.arg, test.expected);
      });
    });
  });

  describe('Class Tests', () => {
    describe('Declarations', () => {
      tests = [
        {
          arg: 'class Hello:\n⇨build(_message)\n⇦\n',
          expected: 'Hello  : (ClassSuite (ClassBody (Build (Params (Field _message))) ))',
        },
        {
          arg: 'class Hello:\n⇨build()\nsayHi():\n⇨ret "Hello, world!"\n⇦⇦\n',
          expected: 'Hello  : (ClassSuite (ClassBody (Build (Params )) (Method sayHi (Params ) : (Suite (Return "Hello, world!")))))',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, `(Program (Block (ClassDecl ${test.expected})))`);
        });
      });
    });

    describe('Instantiations', () => {
      tests = [
        {
          arg: 'x = new hello()\n',
          expected: '(= x (New hello (FunParams )))',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, `(Program (Block ${test.expected}))`);
        });
      });
    });
  });
  describe('Object Tests', () => {
    describe('Declaration', () => {
      tests = [
        {
          arg: 'foo :=\n  bar:5\n',
          expected: '(Program (Block (ObjDecl foo (PropDecl bar : 5))))',
        },
        {
          arg: 'foo :=\n  bar:5\n  a:1\n  b:2\n  c:3\n',
          expected: '(Program (Block (ObjDecl foo (PropDecl bar : 5),(PropDecl a : 1),(PropDecl b : 2),(PropDecl c : 3))))',
        },
        {
          arg: 'foo :=\n  bar:fal\n  a:tru\n',
          expected: '(Program (Block (ObjDecl foo (PropDecl bar : fal),(PropDecl a : tru))))',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, test.expected);
        });
      });
    });

    describe('Access', () => {
      tests = [
        {
          arg: 'x.y\n',
          expected: '(Access x . y)',
        },
        {
          arg: 'x[0]\n',
          expected: '(x [] 0)',
        },
        {
          arg: 'x.y[0]\n',
          expected: '((Access x . y) [] 0)',
        },
        {
          arg: '[1,2,3][1]\n',
          expected: '([1, 2, 3] [] 1)',
        },
      ];

      tests.forEach((test) => {
        it(`correctly parses \n ${test.arg.trim()}`, () => {
          parseTest(test.arg, `(Program (Block ${test.expected}))`);
        });
      });
    });
  });
});
