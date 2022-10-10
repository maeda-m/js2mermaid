'use strict'

const debug = require('debug')('js2mermaid:format:class')
const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const MethodTraverser = require('./method_traverser')

class ClassTraverser extends AbstractTraverser {
  #methods
  #properties

  constructor (root) {
    super(root)
    this.superClassName = (root.superClass)?.name || null

    const { methods, properties } = this.#traverse(root)
    this.#methods = methods
    this.#properties = properties
  }

  findDef (sourceLocation) {
    if (!this.sourceLocation.isInclude(sourceLocation)) return null

    let result = null
    const finder = (def) => {
      if (def.sourceLocation.isInclude(sourceLocation)) {
        result = def
      }
    }

    this.#methods.forEach(finder)
    if (result) return result

    this.#properties.forEach(finder)
    if (result) return result

    return this
  }

  findConstructor () {
    return this.findMethod('constructor')
  }

  findMethod (name) {
    let result = null
    this.#methods.forEach((method) => {
      if (method.name === name) {
        result = method
      }
    })

    return result
  }

  findProperty (name) {
    let result = null
    this.#properties.forEach((property) => {
      if (property.name === name) {
        result = property
      }
    })

    return result
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
      const property = this.class.createUnnamedClassObject(node)
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
      method.eachAssignment((traverser) => {
        const property = traverser.receivedThisProperty
        if (property) {
          if (!properties.has(property.tag)) {
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

    const uniqProperties = new Map()
    properties.forEach((property) => {
      uniqProperties.set(property.id, property)
    })

    return {
      methods,
      properties: uniqProperties
    }
  }

  toObject () {
    const entries = new Map([
      ['id', this.id],
      ['name', this.name]
    ])
    if (this.superClassName) {
      entries.set('superClass', {
        name: this.superClassName
      })
    }

    const methods = []
    this.#methods.forEach((method) => {
      methods.push(method.toObject())
    })
    entries.set('methods', methods)

    const properties = []
    this.#properties.forEach((property) => {
      properties.push(property.toObject())
    })
    entries.set('properties', properties)

    entries.set('isEmpty', !(properties.length || methods.length))

    return Object.fromEntries(entries)
  }
}

module.exports = ClassTraverser
