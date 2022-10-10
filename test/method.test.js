const assertContainEntries = require('./helper')

const ASTNode = require('../lib/ast_node')
const Registry = require('../lib/registry')

describe('ProgramTraverser#toObject', () => {
  it('method syntax', () => {
    const path = 'test/fixtures/method_syntax.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'Method',
          isEmpty: false,
          methods: [
            {
              name: 'prototypeMethod',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'generatorMethod',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'asyncPrototypeMethod',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'asyncGeneratorMethod',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'getter',
              isStatic: false,
              visibilityKeyword: ''
            },
            {
              name: 'setter',
              isStatic: false,
              visibilityKeyword: ''
            }
          ]
        },
        {
          name: 'ComputedMethod',
          isEmpty: true,
          methods: [],
          properties: []
        },
        {
          name: 'SamePrototypeMethod',
          isEmpty: false,
          methods: [
            {
              name: 'constructor',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: [
                {
                  name: 'sameMethodName',
                  isStatic: false,
                  visibilityKeyword: '',
                  params: []
                },
                {
                  name: 'sameMethodName',
                  isStatic: false,
                  visibilityKeyword: '#',
                  params: []
                }
              ]
            },
            {
              name: 'sameMethodName',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'sameMethodName',
              isStatic: false,
              visibilityKeyword: '#',
              params: [],
              callees: []
            }
          ],
          properties: []
        },
        {
          name: 'SameStaticMethod',
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
              name: 'sameMethodName',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'sameMethodName',
              isStatic: true,
              visibilityKeyword: '#',
              params: [],
              callees: []
            },
            {
              name: '',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: [
                {
                  name: 'sameMethodName',
                  isStatic: true,
                  visibilityKeyword: '',
                  params: []
                },
                {
                  name: 'sameMethodName',
                  isStatic: true,
                  visibilityKeyword: '#',
                  params: []
                }
              ]
            }
          ],
          properties: []
        }
      ],
      newers: [],
      callers: [
        {
          caller: {
            name: 'constructor',
            isStatic: false,
            visibilityKeyword: '',
            params: []
          },
          callee: {
            name: 'sameMethodName',
            isStatic: true,
            visibilityKeyword: '',
            params: []
          }
        },
        {
          caller: {
            name: 'constructor',
            isStatic: false,
            visibilityKeyword: '',
            params: []
          },
          callee: {
            name: 'sameMethodName',
            isStatic: true,
            visibilityKeyword: '#',
            params: []
          }
        }
      ],
      path,
      main: {
        name: 'main',
        isStatic: false,
        visibilityKeyword: ''
      }
    }

    assertContainEntries(received, expected)
  })

  it('public method', () => {
    const path = 'test/fixtures/method_public.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'PublicMethod',
          isEmpty: false,
          methods: [
            {
              name: 'classMethod',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'classPrivateMethod',
              isStatic: true,
              visibilityKeyword: '#',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'getter',
              isStatic: true,
              visibilityKeyword: ''
            },
            {
              name: 'setter',
              isStatic: true,
              visibilityKeyword: ''
            }
          ]
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

  it('private method', () => {
    const path = 'test/fixtures/method_private.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'PrivateMethod',
          isEmpty: false,
          methods: [
            {
              name: 'prototypePrivateMethod',
              isStatic: false,
              visibilityKeyword: '#',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'getter',
              isStatic: false,
              visibilityKeyword: '#'
            },
            {
              name: 'setter',
              isStatic: false,
              visibilityKeyword: '#'
            }
          ]
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
