'use strict'

const SourceLocation = require('../source_location')

class AbstractTraverser {
  constructor (root) {
    this.name = root.name || root.id?.name || root.key?.name
    this.isPrivate = [root.type, root.key?.type].includes('PrivateIdentifier')
    this.isStatic = !!root.static
    this.sourceLocation = new SourceLocation(root.loc)
    this.nodeLocation = {
      start: root.start,
      end: root.end
    }
  }

  get id () {
    return `${this.sourceLocation.id}_${this.tag}`
  }

  get tag () {
    return `${this.#staticKeyword}${this.#visibilityKeyword}${this.name}`
  }

  get class () {
    return this.constructor
  }

  get #staticKeyword () {
    return this.class.staticKeywordGenerator(this.isStatic, this.isProperty)
  }

  static staticKeywordGenerator (isStatic, isProperty) {
    return isStatic ? 'static ' : (isProperty ? 'this.' : '')
  }

  get isProperty () {
    return false
  }

  get #visibilityKeyword () {
    return this.isPrivate ? '#' : ''
  }
}

module.exports = AbstractTraverser
