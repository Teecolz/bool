const Type = require('./type.js');

class ExpList {
  constructor(exps) {
    this.exps = exps;
  }
  analyze(context) {
    let first = true;

    for (let exp of this.exps) {
      exp.analyze(context);
      if (first) {
        this.type = Type.Construct(`[${exp.type}]`, exp.type.parent);
        this.elementType = exp.type;
        first = false;
      } else {
        exp.type.mustBeCompatibleWith(this.elementType, 'Lists must be composed of compatible types', exp);
        if (exp.type.name === 'float') {
          this.elementType = Type.FLOAT;
          this.type.name = '[float]';
        }
      }
    }
  }
  toString() {
    return `${this.exps.join(', ')}`;
  }
}

module.exports = ExpList;
