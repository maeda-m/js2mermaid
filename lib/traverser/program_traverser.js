'use strict'

const debug = require('debug')('js2mermaid:traverser:program')
const AcornWalker = require('acorn-walk')
const AbstractTraverser = require('./abstract_traverser')
const ClassTraverser = require('./class_traverser')
const MemberTraverser = require('./member_traverser')
const SourceLocation = require('../source_location')

class ProgramTraverser extends AbstractTraverser {
  #path
  #classes
  #newers
  #callers
  #root
  #dictionary

  constructor (root, path) {
    super(root)
    this.#path = path
    this.#root = root

    const { classes, dictionary, newers, callers } = this.#traverse(root)
    this.#classes = classes
    this.#dictionary = dictionary
    this.#newers = newers
    this.#callers = callers
  }

  get id () {
    return this.sourceLocation.sourceFile
  }

  #traverse (root) {
    const classes = new Map()
    const dictionary = new Map()
    const traverse = (node) => {
      if (this.#isNamed(node)) {
        const klass = new ClassTraverser(node)
        classes.set(klass.id, klass)
        dictionary.set(klass.name, klass.id)
      }
    }
    AcornWalker.simple(root, {
      ClassExpression: traverse,
      ClassDeclaration: traverse
    })

    const newers = []
    const callers = []

    const newCallerTraverse = (node) => {
      const newer = new MemberTraverser(node.callee, null, node.arguments)
      classes.forEach((klass) => {
        const def = klass.findDef(newer.sourceLocation)
        if (def) {
          newer.caller = def
        }
      })

      if (!newer.caller) {
        newer.caller = this.#main
      }
      newers.push(newer)
    }

    const staticCallerTraverse = (node) => {
      const called = new MemberTraverser(node.callee, null, node.arguments).edge()
      let caller = null
      if (this.#isStaticable(called.name)) {
        classes.forEach((klass) => {
          const def = klass.findDef(called.sourceLocation)
          if (def) {
            caller = def
          }
        })
        if (!caller) {
          caller = this.#main
        }
        caller.caller = called
        callers.push(caller)
      }
    }

    AcornWalker.simple(root, {
      NewExpression: newCallerTraverse,
      CallExpression: staticCallerTraverse
    })

    return {
      classes,
      dictionary,
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
    const main = this.class.createUnnamedClassObject(this.#root)
    main.name = 'main'

    return main
  }

  findClass (name) {
    const classId = this.#dictionary.get(name)
    if (classId) {
      return this.#classes.get(classId)
    } else {
      return null
    }
  }

  toObject (traversers) {
    const classes = []
    const overrideConstructor = (object, klass) => {
      const findConstructor = (target) => {
        const superClass = findSuperClass(target.superClassName)
        const initializer = target.findConstructor()
        if (initializer) {
          return initializer
        } else {
          if (superClass) {
            return findConstructor(superClass)
          } else {
            return null
          }
        }
      }

      const findSuperClass = (superClassName) => {
        let result
        traversers.forEach((traverser) => {
          const superClass = traverser.findClass(superClassName)
          if (superClass) {
            result = superClass
          }
        })

        return result
      }

      const superClass = findSuperClass(klass.superClassName)
      if (superClass) {
        const initializer = findConstructor(superClass)
        if (initializer) {
          const s = klass.sourceLocation
          const position = { line: s.start.line, column: undefined }
          const source = new SourceLocation({
            source: s.sourceFile,
            start: position,
            end: position
          })
          const initializerObject = initializer.toObject()
          initializerObject.id = source.id
          object.methods.unshift(initializerObject)
          object.isEmpty = false
          debug(initializerObject)
        }
      }
    }
    this.#classes.forEach((klass) => {
      const object = klass.toObject()
      if (klass.superClassName && !klass.findConstructor()) {
        overrideConstructor(object, klass)
      }
      classes.push(object)
    })

    const newers = []
    this.#newers.forEach((newer) => {
      traversers.forEach((traverser) => {
        const klass = traverser.findClass(newer.name)
        if (klass) {
          const callee = klass.findConstructor() || klass
          const object = {
            caller: newer.caller.toObject(),
            callee: callee.toObject()
          }
          newers.push(object)
        }
      })
    })

    const callers = []
    this.#callers.forEach((caller) => {
      traversers.forEach((traverser) => {
        const klass = traverser.findClass(caller.caller.name)
        if (klass) {
          const name = caller.caller.property.name
          const callee = klass.findMethod(name) || klass.findProperty(name)
          const object = {
            caller: caller.toObject(),
            callee: callee.toObject()
          }
          callers.push(object)
        }
      })
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
