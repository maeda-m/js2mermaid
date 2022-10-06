'use strict'

const fs = require('fs')
const Acorn = require('acorn')
const ProgramTraverser = require('./traverser/program_traverser')

class ASTNode {
  static build (path) {
    const sourceCode = fs.readFileSync(path, 'utf8')
    return this.parse(path, sourceCode)
  }

  static parse (path, sourceCode) {
    const id = path.replaceAll(/[^\w]/g, '_')
    const node = Acorn.parse(sourceCode, {
      sourceFile: id,
      locations: true,
      sourceType: 'module',
      ecmaVersion: 'latest'
    })

    return {
      id,
      node: new ProgramTraverser(node)
    }
  }
}

module.exports = ASTNode
