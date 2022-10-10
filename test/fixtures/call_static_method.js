class CalleeStaticMethod {
  static classMethod () {}

  static {
    this.classMethod()
  }
}

CalleeStaticMethod.classMethod()
