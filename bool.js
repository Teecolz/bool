#!/usr/bin/env node

const fs = require('fs');
const parse = require('./parser.js');
const error = require('./error.js');
require('./generator.js');
const argv = require('yargs')
  .usage('$0 [-a] [-g] filename')
  .boolean(['a', 'g'])
  .describe('a', 'show abstract syntax tree after parsing then stop')
  .describe('g', 'generate and show intermediate code then stop')
  .demand(1)
  .argv;

fs.readFile(argv._[0], 'utf-8', (err, text) => {
  const program = parse(text);
  if (error.count > 0) {
    return;
  }
  if (argv.a) {
    console.log(program.toString());
    program.toString();
    return;
  }
  program.analyze();
  if (argv.g) {
    program.gen();
  }
});
