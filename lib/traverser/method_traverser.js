'use strict'

const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const MemberTraverser = require('./member_traverser')
const SetterTraverser = require('./setter_traverser')
const SourceLocation = require('../source_location')
const Registry = require('../registry')

class MethodTraverser extends AbstractTraverser {
  #members
  #params
  #callees

  constructor (root) {
    super(root)

    const { members, params } = this.#traverse(root)
    this.#members = members
    this.#params = params
    this.#callees = []
  }

  set callee (callee) {
    this.#callees.push(callee)
  }

  eachAssignment (callback) {
    this.#members.forEach((member) => {
      if (member instanceof SetterTraverser) {
        callback(member)
      }
    })
  }

  eachCaller (callback) {
    this.#members.forEach((member) => {
      if (!(member instanceof SetterTraverser)) {
        callback(member)
      }
    })
  }

  #traverse (root) {
    const members = new Registry()
    const breadthFirstNodes = this.#breadthFirstNodes(root)

    const traverse = (breadthFirstNode) => {
      const { node, children } = breadthFirstNode
      let member
      switch (node.type) {
        case 'AssignmentExpression':
          member = new SetterTraverser(node.left, node.right)
          break
        case 'CallExpression':
          member = new MemberTraverser(node.callee, null, node.arguments)
          break
      }

      members.set(member.id, member)
      children.forEach(traverse)
    }
    breadthFirstNodes.forEach(traverse)

    let params = []
    if (root.value?.params) {
      params = root.value.params.map((param) => {
        return new MemberTraverser(param)
      })
    }

    return {
      members,
      params
    }
  }

  #breadthFirstNodes (root) {
    let depthFirstNodes = []
    const registryNode = (body) => {
      AcornWalker.full(body, (node, state, type) => {
        switch (type) {
          case 'AssignmentExpression':
          case 'CallExpression':
            depthFirstNodes.push(node)
            break
        }
      })
    }

    if (root.type === 'StaticBlock') {
      root.body.forEach((node) => {
        registryNode(node.expression)
      })
    } else {
      registryNode(root.value.body)
    }

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

  toObjectWithoutCallee () {
    const object = super.toObject()
    object.params = this.#params.map((param) => {
      return { name: param.name }
    })

    return object
  }

  toObject () {
    const object = this.toObjectWithoutCallee()
    object.callees = this.#callees.map((callee) => {
      return callee.toObjectWithoutCallee()
    })

    return object
  }
}

module.exports = MethodTraverser
