/* eslint-env node, mocha */
const fs = require('fs');
const parse = require('../parser.js');

const testDir = 'test/data/semantic-errors';
const program = parse(fs.readFileSync(`${testDir}/semantic-errors.bool`, { encoding: 'UTF-8' }));
program.analyze();
