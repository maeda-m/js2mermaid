'use strict'

class Format {
  #entries
  #default

  constructor () {
    this.#entries = new Map()
  }

  get default () {
    return this.#default
  }

  get enum () {
    return Array.from(this.#entries.keys())
  }

  add (klass, isDefault = false) {
    this.#entries.set(klass.key, klass)
    if (isDefault) {
      this.#default = klass.key
    }
  }

  render (key, traversers) {
    const printFn = console.log
    this.#entries.get(key).render(traversers, printFn)
  }
}

const registry = new Format()

const ClassDiagram = require('./format/class_diagram')
registry.add(ClassDiagram)

module.exports = registry
