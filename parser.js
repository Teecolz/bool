/* eslint-env node */
/* eslint spaced-comment: "off" */

const ohm = require('ohm-js');
const fs = require('fs');
const Program = require('./entities/program.js');
const Block = require('./entities/block.js');

const exports = module.exports || {};
const gram = ohm.grammar(fs.readFileSync('bool.ohm'));

const semantics = gram.createSemantics().addOperation('ast', {
  Program: b => new Program(b.ast()),
  FunDecl: (id, params, body) => new FunctionDeclaration(id.sourceString, params.ast(), body.ast()),
});

exports.parse = (text) => {
  return 0;
};
