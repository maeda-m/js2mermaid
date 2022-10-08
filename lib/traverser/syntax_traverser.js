'use strict'

const AbstractTraverser = require('./abstract_traverser')
const Syntaxes = require('../syntax')
const { ThisSyntax, NullSyntax, AnySyntax } = Syntaxes

class SyntaxTraverser extends AbstractTraverser {
  static #TABLE

  #root
  #syntax

  static {
    const table = new Map([
      ['IdentifierSyntax', ['Identifier', 'PrivateIdentifier']],
      ['ThisSyntax', ['ThisExpression']],
      ['SuperSyntax', ['Super']],
      ['FunctionSyntax', ['ArrowFunctionExpression', 'FunctionExpression']]
    ])
    this.#TABLE = table
    this.AVAILABLE_TYPES = Array.from(table.values()).flat()
  }

  constructor (root, value) {
    super(root)
    this.#root = root
    this.#syntax = this.#traverse(root, value)

    if (!this.name) {
      this.name = this.#syntax.name
    }
  }

  get root () {
    return this.#root
  }

  get hasThis () {
    return this.#syntax instanceof ThisSyntax
  }

  each (callback) {
    const traverser = this
    callback(traverser)
  }

  #traverse (root, value) {
    if (!root) {
      return new NullSyntax()
    }

    let syntax
    SyntaxTraverser.#TABLE.forEach((types, className) => {
      if (types.includes(root.type)) {
        syntax = new (Syntaxes[className])(root)
      }
    })

    if (syntax) {
      return syntax
    } else {
      return new AnySyntax(root, value)
    }
  }
}

module.exports = SyntaxTraverser
