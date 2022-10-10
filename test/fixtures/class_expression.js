const VarName = class AbstractNamedClass {
  constructor (argName) {}
}

const Inherited = class InheritedEmptyClass extends VarName {}

const Empty = class EmptyClass {}

const UnnamedClass = class {
  constructor (argName) {}
}

function IgnoreES5Class (name) {
  this.name = name
}

IgnoreES5Class.prototype.getName = function () {
  return this.name
}
