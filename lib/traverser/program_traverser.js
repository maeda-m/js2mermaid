'use strict'

const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const ClassTraverser = require('./class_traverser')

class ProgramTraverser extends AbstractTraverser {
  #classes

  constructor (root) {
    super(root)
    this.#classes = this.#traverse(root)
  }

  get classes () {
    return this.#classes
  }

  #traverse (root) {
    const classes = new Map()
    const traverse = (node) => {
      if (this.#isNamed(node)) {
        const klass = new ClassTraverser(node)
        classes.set(klass.id, klass)
      }
    }
    AcornWalker.simple(root, {
      ClassExpression: traverse,
      ClassDeclaration: traverse
    })

    return classes
  }

  #isNamed (node) {
    return !!node.id
  }
}

module.exports = ProgramTraverser
