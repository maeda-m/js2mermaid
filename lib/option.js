'use strict'

const Optionator = require('optionator')
const Format = require('./format')

const Option = Optionator({
  prepend: 'js2mermaid [options] file.js [dir]',
  options: [
    {
      option: 'format',
      type: 'String',
      default: Format.default,
      enum: Format.enum,
      description: '出力する図形の種類を指定します'
    },
    {
      option: 'debug',
      type: 'Boolean',
      default: false,
      description: 'デバッグ情報を出力します'
    },
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'ヘルプ情報を出力します'
    }
  ]
})

module.exports = Option
