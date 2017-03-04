#!/usr/bin/env node

const fs = require('fs');
const parse = require('./parser.js');
const error = require('./error.js');
const argv = require('yargs')
  .usage('$0 [-a] filename')
  .boolean(['a'])
  .describe('a', 'show abstract syntax tree after parsing then stop')
  .demand(1)
  .argv;

console.log(argv);

fs.readFile(argv._[0], 'utf-8', (err, text) => {
  const program = parse(text);
  if (error.count > 0) {
    return;
  }
  if (argv.a) {
    console.log(program.toString());
  }
});
