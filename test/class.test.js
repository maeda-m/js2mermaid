const assertContainEntries = require('./helper')

const ASTNode = require('../lib/ast_node')
const Registry = require('../lib/registry')

describe('ProgramTraverser#toObject', () => {
  it('class declaration', () => {
    const path = 'test/fixtures/class_declaration.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'AbstractNamedClass',
          isEmpty: false,
          methods: [
            {
              name: 'constructor',
              isStatic: false,
              visibilityKeyword: '',
              params: [
                { name: 'argName' }
              ],
              callees: []
            }
          ],
          properties: []
        },
        {
          name: 'InheritedEmptyClass',
          isEmpty: true,
          superClass: {
            name: 'AbstractNamedClass'
          },
          methods: [],
          properties: []
        },
        {
          name: 'EmptyClass',
          isEmpty: true,
          methods: [],
          properties: []
        }
      ],
      newers: [],
      callers: [],
      path,
      main: {
        name: 'main',
        isStatic: false,
        visibilityKeyword: ''
      }
    }

    assertContainEntries(received, expected)
  })

  it('new expression', () => {
    const paths = [
      'test/fixtures/class_declaration.js',
      'test/fixtures/class_new.js'
    ]
    const traversers = new Registry()
    paths.forEach((path) => {
      const traverser = ASTNode.buildTraverser(path)
      traversers.set(traverser.id, traverser)
    })
    const receiveds = traversers.map((traverser) => {
      return traverser.toObject(traversers)
    })

    const expected = {
      classes: [
        {
          name: 'Creator',
          isEmpty: false,
          methods: [
            {
              name: 'constructor',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'build',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: []
            }
          ],
          properties: []
        }
      ],
      newers: [
        {
          caller: {
            name: 'build',
            isStatic: true,
            visibilityKeyword: '',
            params: []
          },
          callee: {
            name: 'EmptyClass',
            isEmpty: true,
            methods: [],
            properties: []
          }
        },
        {
          caller: {
            name: 'main',
            isStatic: false,
            visibilityKeyword: ''
          },
          callee: {
            name: 'constructor',
            isStatic: false,
            visibilityKeyword: '',
          }
        },
        {
          caller: {
            name: 'main',
            isStatic: false,
            visibilityKeyword: ''
          },
          callee: {
            name: 'InheritedEmptyClass'
          }
        }
      ],
      callers: [],
      path: paths[1],
      main: {
        name: 'main',
        isStatic: false,
        visibilityKeyword: ''
      }
    }

    assertContainEntries(receiveds[1], expected)
  })

  it('class expression', () => {
    const path = 'test/fixtures/class_expression.js'
    const traverser = ASTNode.buildTraverser(path)
    const received = traverser.toObject([traverser])

    const expected = {
      classes: [
        {
          name: 'AbstractNamedClass',
          isEmpty: false,
          methods: [
            {
              name: 'constructor',
              isStatic: false,
              visibilityKeyword: '',
              params: [
                { name: 'argName' }
              ],
              callees: []
            }
          ],
          properties: []
        },
        {
          name: 'InheritedEmptyClass',
          isEmpty: true,
          superClass: {
            name: 'VarName'
          },
          methods: [],
          properties: []
        },
        {
          name: 'EmptyClass',
          isEmpty: true,
          methods: [],
          properties: []
        }
      ],
      newers: [],
      callers: [],
      path,
      main: {
        name: 'main',
        isStatic: false,
        visibilityKeyword: ''
      }
    }

    assertContainEntries(received, expected)
  })
})
