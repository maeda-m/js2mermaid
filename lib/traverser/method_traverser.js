'use strict'

const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const MemberTraverser = require('./member_traverser')
const SetterTraverser = require('./setter_traverser')
const SourceLocation = require('../source_location')

class MethodTraverser extends AbstractTraverser {
  #members

  constructor (root) {
    super(root)
    this.#members = this.#traverse(root)
  }

  each (callback) {
    this.#members.forEach((member) => {
      member.each(callback)
    })
  }

  eachSetter (callback) {
    this.#members.forEach((member) => {
      if (member instanceof SetterTraverser) {
        callback(member)
      }
    })
  }

  #traverse (root) {
    const members = new Map()
    const breadthFirstNodes = this.#breadthFirstNodes(root)

    const traverse = (breadthFirstNode) => {
      const { node, children } = breadthFirstNode

      let member
      switch (node.type) {
        case 'AssignmentExpression':
          member = new SetterTraverser(node.left, node.right)
          break
        case 'NewExpression':
        case 'CallExpression':
          member = new MemberTraverser(node.callee, null, node.arguments)
          break
      }

      members.set(member.id, member)
      children.forEach(traverse)
    }
    breadthFirstNodes.forEach(traverse)

    return members
  }

  #breadthFirstNodes (root) {
    let depthFirstNodes = []
    AcornWalker.full(root.value.body, (node, state, type) => {
      switch (type) {
        case 'AssignmentExpression':
        case 'CallExpression':
        case 'NewExpression':
          depthFirstNodes.push(node)
          break
        default:
          break
      }
    })

    const recursive = (sortedArray) => {
      const results = []
      const iterator = sortedArray.entries()
      let skipIndex = -1
      for (const [i, parentableNode] of iterator) {
        if (i <= skipIndex) continue
        const childableNodes = sortedArray.slice(i + 1)
        const childNodes = childableNodes.filter((childableNode) => {
          return this.#isInclude(parentableNode, childableNode)
        })

        skipIndex = i + childNodes.length
        results.push({
          node: parentableNode,
          children: recursive(childNodes)
        })
      }

      return results
    }
    depthFirstNodes = depthFirstNodes.sort((a, b) => {
      return this.#isInclude(a, b) ? -1 : 1
    })

    return recursive(depthFirstNodes)
  }

  #isInclude (a, b) {
    const left = new SourceLocation(a.loc)
    const right = new SourceLocation(b.loc)

    return left.isInclude(right)
  }
}

module.exports = MethodTraverser
