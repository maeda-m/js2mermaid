'use strict'

const {
  AbstractFormat,
  p,
  pp,
  ppp
} = require('./abstract_format')

const rendered = new Map()

class CallGraph extends AbstractFormat {
  static render (programs) {
    p('flowchart LR')

    programs.forEach((program) => {
      p(`subgraph ${program.id}[${program.path}]`)
      pp(this.#toMermaidNode(program.main, false))

      program.classes.forEach((klass) => {
        pp(`subgraph ${klass.id}[${klass.name}]`)

        klass.methods.forEach((method) => {
          ppp(this.#toMermaidNode(method, false))

          method.callees.forEach((callee) => {
            ppp(this.#toMermaidRelationship('-->', method, callee))
          })
        })
        pp('end')
      })
      p('end')
    })

    programs.forEach((program) => {
      program.newers.forEach((newer) => {
        pp(this.#toMermaidRelationship('-.->', newer.caller, newer.callee))
      })
      program.callers.forEach((item) => {
        pp(this.#toMermaidRelationship('-->', item.caller, item.callee))
      })
    })

    p('%% svg style')
    p('classDef sourceFileSubgraph fill-opacity: 0')
    programs.forEach((program) => {
      p(`class ${program.id} sourceFileSubgraph`)
    })
  }

  static #toMermaidRelationship (link, caller, callee) {
    const callerNode = this.#toMermaidNode(caller, false)
    const calleeNode = this.#toMermaidNode(callee, false)
    const relationship = `${callerNode} ${link} ${calleeNode}`

    if (rendered.has(relationship)) {
      return ''
    } else {
      rendered.set(relationship)
      return relationship
    }
  }

  static #toMermaidNode (item, isProperty) {
    const content = this.toMermaidAttribute(item, isProperty)
    return `${item.id}["${content}"]`
  }
}

module.exports = CallGraph
