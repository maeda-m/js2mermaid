const assertContainEntries = require('./helper')

const ASTNode = require('../lib/ast_node')
const Registry = require('../lib/registry')

describe('ProgramTraverser#toObject', () => {
  it('property syntax', () => {
    const path = 'test/fixtures/property_syntax.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'InstanceProperty',
          isEmpty: false,
          methods: [
            {
              name: 'constructor',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            }
          ],
          properties: [
            {
              name: 'propertyName',
              isStatic: false,
              visibilityKeyword: ''
            }
          ]
        },
        {
          name: 'StaticProperty',
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
              name: 'staticPropertyName',
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
})
