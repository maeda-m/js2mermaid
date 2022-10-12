'use strict'

const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const ClassTraverser = require('./class_traverser')
const MemberTraverser = require('./member_traverser')
const Registry = require('../registry')

class ProgramTraverser extends AbstractTraverser {
  #path
  #classes
  #newers
  #callers
  #root

  constructor (root, path) {
    super(root)
    this.#path = path
    this.#root = root

    const { classes, newers, callers } = this.#traverse(root)
    this.#classes = classes
    this.#newers = newers
    this.#callers = callers
  }

  get id () {
    return this.sourceLocation.sourceFile
  }

  #traverse (root) {
    const classes = new Registry()
    const classRegister = (node) => {
      if (this.#isNamed(node)) {
        const klass = new ClassTraverser(node)
        classes.set(klass.id, klass)
      }
    }
    AcornWalker.simple(root, {
      ClassExpression: classRegister,
      ClassDeclaration: classRegister
    })

    const newers = []
    const newCallerTraverse = (node) => {
      const called = new MemberTraverser(node.callee, null, node.arguments)
      const callee = {
        name: called.name
      }

      let caller = classes.take((klass) => {
        return klass.findDefine(called.sourceLocation)
      })
      if (!caller) {
        caller = this.#main
      }

      newers.push({
        callee,
        caller
      })
    }

    const callers = []
    const staticCallerTraverse = (node) => {
      const callee = new MemberTraverser(node.callee, null, node.arguments)
      if (this.#isStaticable(callee.name)) {
        let caller = classes.take((klass) => {
          return klass.findDefine(callee.sourceLocation)
        })
        if (!caller) {
          caller = this.#main
        }

        callers.push({
          callee,
          caller
        })
      }
    }

    AcornWalker.simple(root, {
      NewExpression: newCallerTraverse,
      CallExpression: staticCallerTraverse
    })

    return {
      classes,
      newers,
      callers
    }
  }

  #isNamed (node) {
    return !!node.id
  }

  #isStaticable (name) {
    return /^[A-Z]\w+$/.test(name)
  }

  get #main () {
    const Main = class extends AbstractTraverser {}
    const main = new Main(this.#root)
    main.name = 'main'

    return main
  }

  findClass (name) {
    return this.#classes.findByName(name)
  }

  toObject (traversers) {
    const classes = this.#classes.map((klass) => {
      return klass.toObject()
    })

    const newers = []
    this.#newers.forEach((object) => {
      traversers.forEach((traverser) => {
        const className = object.callee.name
        const klass = traverser.findClass(className)
        if (klass) {
          const callee = klass.findConstructor() || klass
          newers.push({
            caller: object.caller.toObject(),
            callee: callee.toObject()
          })
        }
      })
    })

    const callers = []
    this.#callers.forEach((object) => {
      const className = object.callee.name
      const calleeClass = traversers.take((traverser) => {
        return traverser.findClass(className)
      })

      if (calleeClass) {
        const calleeMethod = calleeClass.findMethod({
          name: object.callee.anyCaller.name,
          isPrivate: object.callee.anyCaller.isPrivate
        })
        if (calleeMethod) {
          callers.push({
            caller: object.caller.toObject(),
            callee: calleeMethod.toObjectWithoutCallee()
          })
        }
      }
    })

    return {
      id: this.id,
      path: this.#path,
      main: this.#main.toObject(),
      classes,
      newers,
      callers
    }
  }
}

module.exports = ProgramTraverser
