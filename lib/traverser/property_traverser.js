'use strict'

const AbstractTraverser = require('./abstract_traverser')

class PropertyTraverser extends AbstractTraverser {
  get tag () {
    const staticKeyword = this.isStatic ? 'static.' : ''
    return `${staticKeyword}${this.visibilityKeyword}${this.name}`
  }
}

module.exports = PropertyTraverser
