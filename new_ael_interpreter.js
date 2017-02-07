// Example usage:
//   $ node ael.js '8 + (7 / 2)'
//   11.5

const ohm = require('ohm-js');

const aelGrammar = ohm.grammar(`Ael {
  Exp     = Exp "+" Term     --plus
          | Exp "-" Term     --minus
          | Term
  Term    = Term "*" Factor  --times
          | Term "/" Factor  --divide
          | Term "^" Factor  --exponent
          | Factor
  Factor  = "-" Primary      --negate
          | Primary
  Primary = "(" Exp ")"      --parens
          | number
  number  = digit+
  space  := " " | "\t"
}`);

// This language is so simple, we don't need an AST.
const semantics = aelGrammar.createSemantics().addOperation('eval', {
  Exp_plus(e, _, t) {return e.eval() + t.eval();},
  Exp_minus(e, _, t) {return e.eval() - t.eval();},
  Term_times(t, _, f) {return t.eval() * f.eval();},
  Term_divide(t, _, f) {return t.eval() / f.eval();},
  Term_exponent(t, _, f) {return Math.pow(t.eval(), f.eval());},
  Factor_negate(_, p) {return -p.eval();},
  Primary_parens(open, e, close) {return e.eval();},
  number(chars) {return +this.sourceString;},
});

let match = aelGrammar.match(process.argv[2]);
if (match.succeeded()) {
  console.log(semantics(match).eval());
} else {
  console.error(match.message);
  process.exitCode = 1;
}
