class CalleePrivateField {
  #prototypePrivateField
  static #privateClassField

  constructor () {
    this.#prototypePrivateField
  }

  static {
    this.privateClassField
  }
}
