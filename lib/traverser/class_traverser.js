'use strict'

const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const MethodTraverser = require('./method_traverser')
const PropertyTraverser = require('./property_traverser')
const Registry = require('../registry')

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

  findDefine (sourceLocation) {
    if (!this.sourceLocation.isInclude(sourceLocation)) return null

    const found = this.#methods.find((method) => {
      return method.sourceLocation.isInclude(sourceLocation)
    })
    if (found) return found

    return this
  }

  findMethod (attrs) {
    return this.#methods.findByAttributes(attrs)
  }

  findConstructor () {
    return this.#methods.findByName('constructor')
  }

  #traverse (root) {
    const methods = new Registry()
    const properties = new Registry()

    const methodRegister = (node) => {
      if (node.computed) return
      const method = new MethodTraverser(node)
      methods.set(method.id, method)
    }

    const propertyRegister = (node) => {
      if (node.computed) return
      const property = new PropertyTraverser(node)
      properties.set(property.tag, property)
    }

    AcornWalker.simple(root, {
      MethodDefinition: (node) => {
        if (node.computed) return
        switch (node.kind) {
          case 'constructor':
          case 'method':
            methodRegister(node)
            break
          case 'set':
          case 'get':
            propertyRegister(node)
            break
        }
      },
      PropertyDefinition: (node) => {
        if (node.value?.type === 'ArrowFunctionExpression') {
          methodRegister(node)
        } else {
          propertyRegister(node)
        }
      }
    })

    const noDefinitionPropertyRegister = (method) => {
      method.eachAssignment((traverser) => {
        const property = traverser.thisCaller
        if (property && !properties.has(property.tag)) {
          propertyRegister(property.merge(method.isStatic))
        }
      })
    }
    AcornWalker.simple(root, {
      StaticBlock: methodRegister
    })
    methods.forEach(noDefinitionPropertyRegister)

    const registryThisReceiverMethodCaller = (method) => {
      method.eachCaller((traverser) => {
        const called = traverser.thisCaller
        if (called) {
          const callee = methods.findByAttributes({
            name: called.name,
            isPrivate: called.isPrivate,
            isStatic: method.isStatic
          })
          if (callee) {
            method.callee = callee
          }
        }
      })
    }
    methods.forEach(registryThisReceiverMethodCaller)

    return {
      methods,
      properties
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

    const methods = this.#methods.map((method) => {
      return method.toObject()
    })
    const properties = this.#properties.map((property) => {
      return property.toObject()
    })
    entries.set('methods', methods)
    entries.set('properties', properties)
    entries.set('isEmpty', !(properties.length || methods.length))

    return Object.fromEntries(entries)
  }
}

module.exports = ClassTraverser
