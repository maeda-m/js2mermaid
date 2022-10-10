class Creator {
  constructor () {}
  static build () {
    return new EmptyClass()
  }
}

new Creator()

function namedFunction () {
  new InheritedEmptyClass()
}
