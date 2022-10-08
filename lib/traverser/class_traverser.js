'use strict'

const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const MethodTraverser = require('./method_traverser')
const PropertyTraverser = require('./property_traverser')

class ClassTraverser extends AbstractTraverser {
  #methods
  #properties

  constructor (root) {
    super(root)
    this.superClass = (root.superClass)?.name || null

    const { methods, properties } = this.#traverse(root)
    this.#methods = methods
    this.#properties = properties
  }

  get methods () {
    return this.#methods
  }

  get properties () {
    return this.#properties
  }

  #traverse (root) {
    const methods = new Map()
    const properties = new Map()

    const methodTraverse = (node) => {
      if (node.computed) return

      let method
      switch (node.kind) {
        case 'constructor':
        case 'method':
          method = new MethodTraverser(node)
          methods.set(method.id, method)
          break
        case 'set':
        case 'get':
          propertyTraverse(node)
          break
      }
    }

    const propertyTraverse = (node) => {
      if (node.computed) return

      const property = new PropertyTraverser(node)
      properties.set(property.tag, property)
    }

    AcornWalker.simple(root, {
      MethodDefinition: methodTraverse,
      PropertyDefinition: (node) => {
        if (node.value?.type === 'ArrowFunctionExpression') {
          methodTraverse(node)
        } else {
          propertyTraverse(node)
        }
      }
    })

    const noDefinitionPropertyTraverse = (method, isStatic) => {
      method.eachSetter((traverser) => {
        const property = traverser.receivedProperty
        if (property) {
          const tag = property.class.staticKeywordGenerator(isStatic, true)
          if (!properties.has(tag)) {
            property.root.static = isStatic
            propertyTraverse(property.root)
          }
        }
      })
    }

    methods.forEach((method) => {
      noDefinitionPropertyTraverse(method, false)
    })

    AcornWalker.simple(root, {
      StaticBlock: (blockNode) => {
        blockNode.body.forEach((node) => {
          const method = new MethodTraverser({
            loc: blockNode.loc,
            value: {
              body: node
            }
          })
          noDefinitionPropertyTraverse(method, true)
        })
      }
    })

    return {
      methods,
      properties
    }
  }
}

module.exports = ClassTraverser
