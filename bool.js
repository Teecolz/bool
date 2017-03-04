#!/usr/bin/env node

const argv = require('yargs')
  .usage('$0 [-a] filename')
  .boolean(['a'])
  .describe('a', 'show abstract syntax tree after parsing then stop')
  .default({
    target: 'js',
  })
  .demand(1)
  .argv;

const fs = require('fs');
const parse = require('./parser');
const error = require('./error');

fs.readFile(argv._[0], 'utf-8', (err, text) => {
  const program = parse(text);
  if (error.count > 0) {
    return;
  }
  if (argv.a) {
    program.toString();
    return;
  }
  program.analyze();
});
