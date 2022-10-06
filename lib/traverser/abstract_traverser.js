'use strict'

const SourceLocation = require('../util/source_location')

class AbstractTraverser {
  constructor (root) {
    this.name = root.name || root.id?.name || root.key?.name
    this.private = [root.type, root.key?.type].includes('PrivateIdentifier')
    this.static = !!root.static
    this.sourceLocation = new SourceLocation(root.loc)
    this.nodeLocation = {
      start: root.start,
      end: root.end
    }
  }

  get id () {
    return `${this.sourceLocation.id}_${this.tag}`
  }

  get staticKeyword () {
    return this.static ? 'static ' : ''
  }

  get #visibilityKeyword () {
    return this.private ? '#' : ''
  }

  get tag () {
    return `${this.staticKeyword}${this.#visibilityKeyword}${this.name}`
  }
}

module.exports = AbstractTraverser
