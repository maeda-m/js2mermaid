'use strict'

class IdentifierSyntax {
  constructor (node) {
    this.name = node?.name || (node.id)?.name
  }
}

class ThisSyntax extends IdentifierSyntax {
  constructor (node) {
    super(node)
    this.name = 'this'
  }
}

class SuperSyntax extends IdentifierSyntax {
  constructor (node) {
    super(node)
    this.name = 'super'
  }
}

class FunctionSyntax extends IdentifierSyntax {
  constructor (node) {
    super(node)
    this.async = node.async

    if (!this.name) {
      this.name = 'function'
    }
  }
}

class NullSyntax extends IdentifierSyntax {
  constructor () {
    super()
    this.name = 'null'
  }
}

class AnySyntax extends IdentifierSyntax {
  constructor (node, value) {
    super(node)
    this.name = 'any'
    this.value = value
  }
}

module.exports = {
  IdentifierSyntax,
  ThisSyntax,
  SuperSyntax,
  FunctionSyntax,
  NullSyntax,
  AnySyntax
}
