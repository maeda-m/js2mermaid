#!/usr/bin/env node
'use strict'

const debug = require('debug')('js2mermaid:cli')
const Option = require('../lib/option')

let option
try {
  option = Option.parse(process.argv)
} catch (error) {
  console.log(error.message)
  process.exit(2)
}

if (option.debug) {
  require('debug').enable('js2mermaid:*')
}
debug('format', option.format)

const patterns = option._
if (option.help || !patterns.length) {
  console.info(Option.generateHelp())
  process.exit(0)
}

const Dir = require('../lib/dir')
const ASTNode = require('../lib/ast_node')
const Format = require('../lib/format')
const Registry = require('../lib/registry')

const traversers = new Registry()
Dir.glob(patterns).forEach((path) => {
  debug(path)
  const traverser = ASTNode.buildTraverser(path)
  traversers.set(traverser.id, traverser)
})

const objects = traversers.map((traverser) => {
  return traverser.toObject(traversers)
})
Format.render(option.format, objects)
