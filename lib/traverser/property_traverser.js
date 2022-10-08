'use strict'

const AbstractTraverser = require('./abstract_traverser')

class PropertyTraverser extends AbstractTraverser {
  get isProperty () {
    return true
  }
}

module.exports = PropertyTraverser
