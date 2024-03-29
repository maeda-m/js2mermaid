'use strict'

const SyntaxTraverser = require('./syntax_traverser')

class MemberTraverser {
  constructor (receiver, property = null, args = []) {
    this.receiver = this.#traverse(receiver)
    this.property = this.#traverse(property)
    this.args = args.map((arg) => {
      return this.#traverse(arg)
    })
  }

  get id () {
    return this.receiver.id
  }

  get name () {
    return this.receiver.name
  }

  get sourceLocation () {
    return this.receiver.sourceLocation
  }

  get hasThis () {
    return this.receiver.receiver?.isThis
  }

  get thisCaller () {
    if (this.hasThis) {
      return this.anyCaller
    } else {
      return null
    }
  }

  get anyCaller () {
    return this.receiver.property
  }

  #traverse (root) {
    if (!root) {
      return null
    }

    const recursive = (node) => {
      let value
      switch (node.type) {
        case 'Literal':
          value = node.value
          break
        case 'ArrayPattern':
        case 'ArrayExpression':
          value = node.elements.map((element) => {
            return new MemberTraverser(element)
          })
          break
        case 'ObjectPattern':
        case 'ObjectExpression':
          value = new Map()
          node.properties.forEach((property) => {
            value.set(property.key.name, new MemberTraverser(property.value))
          })
          break
        case 'TemplateLiteral':
          value = node.expressions.map((expression) => {
            return new MemberTraverser(expression)
          })
          break
      }

      return new SyntaxTraverser(node, value)
    }

    switch (root.type) {
      case 'NewExpression':
      case 'CallExpression':
        return new MemberTraverser(root.callee, null, root.arguments)
      case 'MemberExpression':
        return new MemberTraverser(root.object, root.property)
      case 'AwaitExpression':
        return new MemberTraverser(root.argument.callee, null, root.argument.arguments)
      case 'UnaryExpression':
      case 'RestElement':
        return new MemberTraverser(root.argument)
      case 'BinaryExpression':
      case 'LogicalExpression':
      case 'AssignmentPattern':
        return new MemberTraverser(root.left, root.right)
      case 'ChainExpression':
        return new MemberTraverser(root.expression)

      default:
        return recursive(root)
    }
  }
}

module.exports = MemberTraverser
