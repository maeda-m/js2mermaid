'use strict'

const SourceLocation = require('../source_location')

class AbstractTraverser {
  constructor (root) {
    this.name = root.name || root.id?.name || root.key?.name || ''
    this.isPrivate = [root.type, root.key?.type].includes('PrivateIdentifier')
    this.isStatic = root.type === 'StaticBlock' || !!root.static
    this.sourceLocation = new SourceLocation(root.loc)
  }

  get id () {
    return this.sourceLocation.id
  }

  get visibilityKeyword () {
    return this.isPrivate ? '#' : ''
  }

  toObject () {
    return {
      id: this.id,
      name: this.name,
      isStatic: this.isStatic,
      visibilityKeyword: this.visibilityKeyword
    }
  }
}

module.exports = AbstractTraverser
