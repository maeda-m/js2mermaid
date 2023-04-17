'use strict'

const AbstractTraverser = require('./abstract_traverser')
const {
  IdentifierSyntax,
  ThisSyntax,
  SuperSyntax,
  FunctionSyntax,
  NullSyntax,
  AnySyntax
} = require('../syntax')

class SyntaxTraverser extends AbstractTraverser {
  #root
  #syntax

  constructor (root, value) {
    super(root)
    this.#root = root
    this.#syntax = this.#traverse(root, value)

    if (!this.name) {
      this.name = this.#syntax.name
    }
  }

  merge (isStatic) {
    const root = Object.assign({}, this.#root)
    root.static = isStatic

    return root
  }

  get isThis () {
    return this.#syntax instanceof ThisSyntax
  }

  #traverse (root, value) {
    if (!root) {
      return new NullSyntax()
    }

    let syntax
    switch (root.type) {
      case 'Identifier':
      case 'PrivateIdentifier':
        syntax = new IdentifierSyntax(root)
        break
      case 'ThisExpression':
        syntax = new ThisSyntax(root)
        break
      case 'Super':
        syntax = new SuperSyntax(root)
        break
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        syntax = new FunctionSyntax(root)
        break
    }

    if (syntax) {
      return syntax
    } else {
      return new AnySyntax(root, value)
    }
  }
}

module.exports = SyntaxTraverser
