class CalleePrivateMethod {
  #prototypePrivateMethod () {}
  static #privateClassMethod () {}

  constructor () {
    this.#prototypePrivateMethod()
  }

  static {
    this.#privateClassMethod()
  }
}
