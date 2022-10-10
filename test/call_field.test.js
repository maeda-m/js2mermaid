const assertContainEntries = require('./helper')

const ASTNode = require('../lib/ast_node')
const Registry = require('../lib/registry')

describe('ProgramTraverser#toObject', () => {
  it('call static field', () => {
    const path = 'test/fixtures/call_static_field.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'CalleeStaticField',
          isEmpty: false,
          methods: [
            {
              name: '',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'staticField',
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

  it('call private field', () => {
    const path = 'test/fixtures/call_private_field.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'CalleePrivateField',
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
              name: '',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'prototypePrivateField',
              isStatic: false,
              visibilityKeyword: '#'
            },
            {
              name: 'privateClassField',
              isStatic: true,
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
