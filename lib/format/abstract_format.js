'use strict'

class AbstractFormat {
  static get key () {
    return this.name.replace(/^(?<initial>[A-Z])/, (result) => {
      return result.toLowerCase()
    }).replaceAll(/[A-Z]/g, (result) => {
      return `-${result.toLowerCase()}`
    })
  }

  static render (programs) {
    throw Error('Not Implemented')
  }

  static toMermaidAttribute (item, isThis = false) {
    return [
      this.staticKeyword(item.isStatic, isThis),
      item.visibilityKeyword,
      item.name,
      this.paramsKeyword(item.params)
    ].join('')
  }

  static staticKeyword (isStatic, isThis = false) {
    return isStatic ? 'static ' : (isThis ? 'this.' : '')
  }

  static paramsKeyword (params) {
    if (!params) return ''

    params = params.map((param) => {
      return param.name
    })

    return `(${params.join(', ')})`
  }
}

const p = (str, depth = 0) => {
  if (str) {
    const indent = '  '.repeat(depth)
    console.log(`${indent}${str}`)
  }
}
const pp = (str) => {
  p(str, 1)
}
const ppp = (str) => {
  p(str, 2)
}

module.exports = {
  AbstractFormat,
  p,
  pp,
  ppp
}
