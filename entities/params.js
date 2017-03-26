class Parameters {
  constructor(params) {
    this.params = params;
    this.length = params.length;
  }

  analyze(context) {
    for (let param of this.params) {
      if (param.length > 0) {
        const parameter = param[0];
        parameter.analyze(context);
        // parameter.type.mustBeArbitrary(`Parameters must be variable, found value ${parameter.val}`, parameter);
        // context.addVariable(parameter.name, parameter);
      }
    }
  }

  toString() {
    return `(Params ${this.params.join(',').replace(/,$/, '')})`;
  }
}

module.exports = Parameters;
