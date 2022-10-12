'use strict'

const debug = require('debug')('js2mermaid:registry')

class Registry extends Map {
  find (finder) {
    let found = null
    this.forEach((value, id) => {
      if (finder(value, id)) {
        found = value
      }
    })

    return found
  }

  findByName (name) {
    return this.findByAttributes({ name })
  }

  findByAttributes (attrs) {
    attrs = Object.entries(attrs)
    const found = this.find((value) => {
      return attrs.every(([k, v], i) => {
        return value[k] === v
      })
    })

    return found
  }

  map (mapper) {
    const results = []
    this.forEach((value, id) => {
      results.push(mapper(value, id))
    })

    return results
  }

  take (taker) {
    let results = this.map(taker)
    results = results.filter((v) => {
      return !!v
    })

    if (results.length > 1) {
      debug(taker)
      debug(results)
    }

    return results[0]
  }
}

module.exports = Registry
