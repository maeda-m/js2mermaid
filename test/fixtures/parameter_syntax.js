class Parameter {
  constructor (argName = this.defaultName(), ...manyMoreArgs) {}

  defaultName () {
    return this.undefinedMethod?.()
  }

  addition ([x = 1, y = 2] = []) {
    return x + y
  }

  subtraction ({ x = 2, y = 1 } = {}) {
    return x - y
  }
}
