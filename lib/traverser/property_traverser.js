'use strict'

const AbstractTraverser = require('./abstract_traverser')

class PropertyTraverser extends AbstractTraverser {
  get staticKeyword () {
    return super.staticKeyword || 'this.'
  }
}

module.exports = PropertyTraverser
