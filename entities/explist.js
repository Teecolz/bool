const Type = require('./type.js');

class ExpList {
  constructor(exps) {
    this.exps = exps;
  }
  analyze(context) {
    let first = true;
    this.exps.forEach((exp) => {
      exp.analyze(context);
      if (first) {
        this.type = Type.Construct(`[${exp.type}]`, exp.type.parent);
        this.elementType = exp.type;
        first = false;
      } else {
        const errorMessage = 'Lists must be composed of compatible types';
        exp.type.mustBeCompatibleWith(this.elementType, errorMessage, exp);
        if (exp.type.name === 'float') {
          this.elementType = Type.FLOAT;
          this.type.name = '[float]';
        }
      }
    });
  }
  optimize() {
    this.exps = this.exps.map(e => e.gen());
    return this;
  }
  toString() {
    return `${this.exps.join(', ')}`;
  }
}

module.exports = ExpList;
