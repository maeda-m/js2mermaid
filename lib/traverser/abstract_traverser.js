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
    return this.sourceLocation.id
  }

  get tag () {
    return this.class.tag(this.isPrivate, this.name)
  }

  get class () {
    return this.constructor
  }

  static tag (isPrivate, name) {
    return `${this.visibilityKeyword(isPrivate)}${name}`
  }

  static visibilityKeyword (isPrivate) {
    return isPrivate ? '#' : ''
  }

  toObject () {
    return {
      id: this.id,
      tag: this.tag,
      name: this.name,
      isStatic: this.isStatic,
      visibilityKeyword: this.class.visibilityKeyword(this.isPrivate)
    }
  }
}

module.exports = AbstractTraverser
