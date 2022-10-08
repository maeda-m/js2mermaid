'use strict'

const MemberTraverser = require('./member_traverser')

class SetterTraverser extends MemberTraverser {
  get receivedProperty () {
    if (this.receiver instanceof MemberTraverser) {
      if (this.receiver.hasThis) {
        return this.receiver.property
      } else {
        return null
      }
    } else {
      return null
    }
  }
}

module.exports = SetterTraverser
