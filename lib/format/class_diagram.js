'use strict'

const AbstractFormat = require('./abstract_format')

class ClassDiagram extends AbstractFormat {
  static render (traversers, p) {
    p('classDiagram')

    const pp = (str) => {
      return p(`  ${str}`)
    }

    traversers.forEach((traverser) => {
      const classes = traverser.classes
      classes.forEach((klass) => {
        if (klass.isEmpty) {
          p(`class ${klass.name}`)
        } else {
          p(`class ${klass.name} {`)
          this.#renderItems(klass.properties, pp)
          this.#renderItems(klass.methods, pp)
          p('}')
        }

        if (klass.superClass) {
          p(`${klass.name} --|> ${klass.superClass}`)
        }
      })
    })
  }

  static #renderItems (items, pp) {
    items.forEach((item) => {
      const factors = [
        this.staticKeyword(item.isStatic),
        item.visibilityKeyword,
        item.name,
        this.paramsKeyword(item.params)
      ]
      if (item.isStatic) {
        factors.push('$')
      }

      pp(factors.join(''))
    })
  }
}

module.exports = ClassDiagram
