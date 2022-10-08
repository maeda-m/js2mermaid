'use strict'

const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const ClassTraverser = require('./class_traverser')

class ProgramTraverser extends AbstractTraverser {
  #path
  #classes

  constructor (root, path) {
    super(root)
    this.#path = path
    this.#classes = this.#traverse(root)
  }

  get id () {
    return this.sourceLocation.sourceFile
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

  toObject () {
    const classes = []
    this.#classes.forEach((klass) => {
      classes.push(klass.toObject())
    })

    return {
      id: this.id,
      path: this.#path,
      classes
    }
  }
}

module.exports = ProgramTraverser
