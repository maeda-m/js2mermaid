const assertContainEntries = require('./helper')

const ASTNode = require('../lib/ast_node')
const Registry = require('../lib/registry')

describe('ProgramTraverser#toObject', () => {
  it('call static method', () => {
    const path = 'test/fixtures/call_static_method.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'CalleeStaticMethod',
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
              name: '',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: [
                {
                  name: 'classMethod',
                  isStatic: true,
                  visibilityKeyword: '',
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
            name: 'main',
            isStatic: false,
            visibilityKeyword: ''
          },
          callee: {
            name: 'classMethod',
            isStatic: true,
            visibilityKeyword: '',
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

  it('call private method', () => {
    const path = 'test/fixtures/call_private_method.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'CalleePrivateMethod',
          isEmpty: false,
          methods: [
            {
              name: 'prototypePrivateMethod',
              isStatic: false,
              visibilityKeyword: '#',
              params: [],
              callees: []
            },
            {
              name: 'privateClassMethod',
              isStatic: true,
              visibilityKeyword: '#',
              params: [],
              callees: []
            },
            {
              name: 'constructor',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: [
                {
                  name: 'prototypePrivateMethod',
                  isStatic: false,
                  visibilityKeyword: '#',
                  params: []
                }
              ]
            },
            {
              name: '',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: [
                {
                  name: 'privateClassMethod',
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
