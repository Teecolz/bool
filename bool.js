#!/usr/bin/env coffee

argv = require 'yargs'
  .usage '$0 [-a] filename'
  .boolean ['a']
  .describe 'a', 'show abstract syntax tree after parsing then stop'
  .demand(1)
  .argv

fs = require 'fs'
parse = require './parser'
generate = (require './bool') argv.target
error = require './error'

fs.readFile argv._[0], 'utf-8', (err, text) ->
  program = parse text
  return if error.count > 0
  if argv.a
    console.log program.toString()
    return
  program.analyze()
  return if error.count > 0
  generate program
