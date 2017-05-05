#!/usr/bin/env node

const fs = require('fs');
const parse = require('./syntax/parser.js');
const error = require('./error.js');
const util = require('util');
require('./backend/generator.js');
const argv = require('yargs')
  .usage('$0 [-a] [-i] [-o] filename')
  .boolean(['a', 'i', 'o'])
  .describe('a', 'show abstract syntax tree after parsing then stop')
  .describe('i', 'generate and show the decorated abstract syntax tree then stop')
  .describe('o', 'do optimizations and show generated code')
  .demand(1)
  .argv;

fs.readFile(argv._[0], 'utf-8', (err, text) => {
  const program = parse(text);
  if (error.count > 0) {
    return;
  }
  if (argv.a) {
    console.log(util.inspect(program, false, null));
    return;
  }
  program.analyze();
  if (error.count > 0) {
    return;
  }
  if (argv.o) {
    program.optimize();
  }
  if (argv.i) {
    console.log(util.inspect(program, false, null));
    return;
  }
  program.gen();
});
