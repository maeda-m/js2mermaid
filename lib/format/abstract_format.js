'use strict'

class AbstractFormat {
  static get key () {
    return this.name.replace(/^(?<initial>[A-Z])/, (result) => {
      return result.toLowerCase()
    }).replaceAll(/[A-Z]/g, (result) => {
      return `-${result.toLowerCase()}`
    })
  }

  static render (classes, p) {
    throw Error('Not Implemented')
  }

  static staticKeyword (isStatic, isProperty = false) {
    return isStatic ? 'static ' : (isProperty ? 'this.' : '')
  }

  static paramsKeyword (params) {
    if (!params) return ''

    params = params.map((param) => {
      return param.name
    })

    return `(${params.join(', ')})`
  }
}

module.exports = AbstractFormat
