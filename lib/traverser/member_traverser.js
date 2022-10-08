'use strict'

const debug = require('debug')('js2mermaid:traverser:member')
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

  get hasThis () {
    return this.receiver.hasThis
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

        default:
          if (!SyntaxTraverser.AVAILABLE_TYPES.includes(node.type)) {
            debug(node)
          }
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
