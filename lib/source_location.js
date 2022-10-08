'use strict'

class Position {
  constructor (position) {
    const { line, column } = position

    this.line = line
    this.column = column
  }

  get id () {
    return `L${this.line}C${this.column}`
  }

  isGreaterThan (other) {
    if (this.line > other.line) return true
    if (this.line === other.line && this.column > other.column) return true

    return false
  }
}

class SourceLocation {
  constructor (sourceLocation) {
    this.sourceFile = sourceLocation.source
    this.start = new Position(sourceLocation.start)
    this.end = new Position(sourceLocation.end)
  }

  get id () {
    return `${this.sourceFile}_${this.start.id}_${this.end.id}`
  }

  isInclude (other) {
    if (this.sourceFile !== other.sourceFile) return false
    if (this.start.isGreaterThan(other.start)) return false
    if (other.end.isGreaterThan(this.end)) return false

    return true
  }
}

module.exports = SourceLocation
