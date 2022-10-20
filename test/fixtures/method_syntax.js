class Method {
  get getter () { return this.propertyValue }
  set setter (valueArg) { this.propertyValue = valueArg }
  prototypeMethod () { return this.propertyValue * 2 }
  * generatorMethod () { yield 'Iterable!' }
  async asyncPrototypeMethod () {}
  async * asyncGeneratorMethod () {}
}

class ComputedMethod {
  get ['get' + 'ter'] () { return null }
  set ['set' + 'ter'] (valueArg) {}
  ['prototype' + 'Method'] () {}
  static ['#class' + 'PrivateMethod'] () {}
  * ['generator' + 'Method'] () { yield 'Iterable!' }
  async ['async' + 'PrototypeMethod'] () {}
  async * ['async' + 'GeneratorMethod'] () {}
}

class SamePrototypeMethod {
  constructor () {
    this.sameMethodName()
    this.#sameMethodName()
  }
  sameMethodName () {}
  #sameMethodName () {}
}

class SameStaticMethod {
  constructor () {
    SameStaticMethod.sameMethodName()
    SameStaticMethod.#sameMethodName()

    this.sameName = new SamePrototypeMethod()
    this.sameName.sameMethodName()
  }
  static {
    this.sameMethodName()
    this.#sameMethodName()
  }
  static sameMethodName () {}
  static #sameMethodName () {}
}

NoDefineClass.method
