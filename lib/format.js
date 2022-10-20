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

  render (key, programs) {
    this.#entries.get(key).render(programs)
  }
}

const format = new Format()

const CallGraph = require('./format/call_graph')
format.add(CallGraph, true)

const ClassDiagram = require('./format/class_diagram')
format.add(ClassDiagram)

module.exports = format
