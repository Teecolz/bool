/* eslint-env node, mocha */
const fs = require('fs');
const ohm = require('ohm-js');
const assert = require('assert');
const parse = require('../parser.js');

const bool = fs.readFileSync('bool.ohm');
const gram = ohm.grammar(bool);

const testDir = 'test/data/semantic-errors';
// const p2 = parse(fs.readFileSync(`${testDir}/newIndent.bool`, { encoding: 'UTF-8' }));
const program = parse(fs.readFileSync(`${testDir}/semantic-errors.bool`, { encoding: 'UTF-8' }));

program.analyze();
