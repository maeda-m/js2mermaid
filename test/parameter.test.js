const assertContainEntries = require('./helper')

const ASTNode = require('../lib/ast_node')
const Registry = require('../lib/registry')

describe('ProgramTraverser#toObject', () => {
  it('parameter syntax', () => {
    const path = 'test/fixtures/parameter_syntax.js'
    const traverser = ASTNode.buildTraverser(path)
    const traversers = new Registry([[traverser.id, traverser]])
    const received = traverser.toObject(traversers)

    const expected = {
      classes: [
        {
          name: 'Parameter',
          isEmpty: false,
          methods: [
            {
              name: 'constructor',
              isStatic: false,
              visibilityKeyword: '',
              params: [
                { name: 'argName' },
                { name: 'manyMoreArgs' }
              ],
              callees: []
            },
            {
              name: 'defaultName',
              isStatic: false,
              visibilityKeyword: '',
              params: [],
              callees: []
            },
            {
              name: 'addition',
              isStatic: false,
              visibilityKeyword: '',
              params: [
                { name: 'x, y' }
              ],
              callees: []
            },
            {
              name: 'subtraction',
              isStatic: false,
              visibilityKeyword: '',
              params: [
                { name: 'x, y' }
              ],
              callees: []
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
