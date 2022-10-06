'use strict'

const PatternCollection = require('dir-glob')
const Glob = require('glob')

class Dir {
  static glob (patterns) {
    patterns = PatternCollection.sync(patterns, {
      extensions: ['js']
    })
    const uniqPatterns = Array.from(new Set(patterns))
    return uniqPatterns.map((pattern) => {
      return Glob.sync(pattern)
    }).flat()
  }
}

module.exports = Dir
