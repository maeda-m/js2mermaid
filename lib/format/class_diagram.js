'use strict'

const {
  AbstractFormat,
  p,
  pp
} = require('./abstract_format')

class ClassDiagram extends AbstractFormat {
  static render (programs) {
    p('classDiagram')

    programs.forEach((program) => {
      program.classes.forEach((klass) => {
        if (klass.isEmpty) {
          p(`class ${klass.name}`)
        } else {
          p(`class ${klass.name} {`)
          this.#renderMermaidAttributes(klass.properties)
          this.#renderMermaidAttributes(klass.methods)
          p('}')
        }

        if (klass.superClass) {
          p(`${klass.name} --|> ${klass.superClass.name}`)
        }
      })
    })
  }

  static #renderMermaidAttributes (items) {
    items.forEach((item) => {
      let content = this.toMermaidAttribute(item)
      if (item.isStatic) {
        content += '$'
      }

      pp(content)
    })
  }
}

module.exports = ClassDiagram
