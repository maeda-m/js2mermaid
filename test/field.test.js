const assertContainEntries = require('./helper')

const ASTNode = require('../lib/ast_node')
const Registry = require('../lib/registry')

describe('ProgramTraverser#toObject', () => {
  it('field syntax', () => {
    const path = 'test/fixtures/field_syntax.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'Field',
          isEmpty: false,
          methods: [
            {
              name: 'fieldMethod',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'fieldName',
              isStatic: false,
              visibilityKeyword: ''
            }
          ]
        },
        {
          name: 'PrivateField',
          isEmpty: false,
          methods: [
            {
              name: 'privateFieldMethod',
              isStatic: false,
              visibilityKeyword: '#',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'privateFieldName',
              isStatic: false,
              visibilityKeyword: '#'
            }
          ]
        },
        {
          name: 'ClassField',
          isEmpty: false,
          methods: [
            {
              name: 'classFieldMethod',
              isStatic: true,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'classPrivateFieldMethod',
              isStatic: true,
              visibilityKeyword: '#',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'classFieldName',
              isStatic: true,
              visibilityKeyword: ''
            },
            {
              name: 'classPrivateFieldName',
              isStatic: true,
              visibilityKeyword: '#'
            }
          ]
        },
        {
          name: 'SameField',
          isEmpty: false,
          methods: [],
          properties: [
            {
              name: 'sameFieldName',
              isStatic: false,
              visibilityKeyword: ''
            },
            {
              name: 'sameFieldName',
              isStatic: true,
              visibilityKeyword: ''
            },
            {
              name: 'sameFieldName',
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
