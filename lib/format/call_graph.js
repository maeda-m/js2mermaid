'use strict'

const debug = require('debug')('js2mermaid:format:call_graph')
const AbstractFormat = require('./abstract_format')

class CallGraph extends AbstractFormat {
  static render (traversers, p) {
    p('flowchart LR')

    const pp = (str) => {
      return p(`  ${str}`)
    }
    const ppp = (str) => {
      return pp(`  ${str}`)
    }

    traversers.forEach((traverser) => {
      p(`subgraph ${traverser.id}[${traverser.path}]`)
      pp(this.#convert(traverser.main, false))

      traverser.classes.forEach((klass) => {
        pp(`subgraph ${klass.id}[${klass.name}]`)

        klass.methods.forEach((method) => {
          ppp(this.#convert(method, false))
        })

        klass.properties.forEach((property) => {
          ppp(this.#convert(property, true))
        })
        pp('end')
      })
      p('end')
    })

    traversers.forEach((traverser) => {
      traverser.newers.forEach((newer) => {
        const caller = this.#convert(newer.caller, false)
        const callee = this.#convert(newer.callee, false)
        pp(`${caller} -.-> ${callee}`)
      })
      traverser.callers.forEach((item) => {
        const caller = this.#convert(item.caller, false)
        const callee = this.#convert(item.callee, false)
        pp(`${caller} --> ${callee}`)
      })
    })

    p('%% svg style')
    p('classDef sourceFileSubgraph fill-opacity: 0')
    traversers.forEach((traverser) => {
      p(`class ${traverser.id} sourceFileSubgraph`)
    })
  }

  static #convert (item, isProperty) {
    const factors = [
      this.staticKeyword(item.isStatic, isProperty),
      item.visibilityKeyword,
      item.name,
      this.paramsKeyword(item.params)
    ]

    return `${item.id}["${factors.join('')}"]`
  }
}

module.exports = CallGraph
