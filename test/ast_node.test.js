const ASTNode = require('../lib/ast_node')

describe('.parse', () => {
  it('path 内のスラッシュなどをアンダーバーに変換して id を返すこと', () => {
    const path = 'path/to/file name.js'

    const traverser = ASTNode.parse(path, '')
    const expected = 'path_to_file_name_js'

    expect(traverser.id).toEqual(expected)
  })
})
