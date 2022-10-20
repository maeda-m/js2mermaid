# js2mermaid

![Version](https://img.shields.io/badge/version-0.9.1-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/github/license/maeda-m/js2mermaid)](https://github.com/maeda-m/js2mermaid/blob/master/LICENSE)

> js2mermaid は JavaScript におけるクラス本体とメソッド定義の呼び出しを [Mermaid.js](https://mermaid-js.github.io/mermaid/) によって可視化し、複雑（Complicated）な場合の認知負荷を軽減したいソフトウェアエンジニア向けの開発者ツールです。

## Install

```sh
npm install js2mermaid
```

## Usage

```sh
npx js2mermaid [options] file.js [dir]
```

### Options

| Option                   | Default | Description              |
| ------------------------ | ------- | ------------------------ |
| `--format call-graph`    | `Yes`   | コールグラフを出力します |
| `--format class-diagram` |         | クラス図を出力します     |
| `--debug`                |         | デバッグ情報を出力します |

## Features

[es2015 以降](https://github.com/estree/estree/blob/master/es2015.md) の [クラス宣言](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#class_declarations) と [名前つきクラス式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#class_expressions) のクラス本体とメソッド定義を解析し、オプションに応じて次のダイアグラムを出力します。なお出力内容は https://mermaid.live/ などで確認してください。

### Call Graph

*e.g. 本リポジトリを出力した例*

```sh
npx js2mermaid --format call-graph bin/js2mermaid.js lib/
```

![call-graph](https://user-images.githubusercontent.com/943541/196910867-f4ece31b-2520-4a32-943f-3d47f615cac4.png)

### Class Diagram

*e.g. 本リポジトリを出力した例*

```sh
npx js2mermaid --format class-diagram bin/js2mermaid.js lib/
```

![class-diagram](https://user-images.githubusercontent.com/943541/195263536-02a3e69f-d371-4271-bc55-86eb35444981.png)

## Run tests

```sh
npm run test
```

## Author

[@maeda-m](https://github.com/maeda-m)

## License

Copyright © 2022 [maeda-m](https://github.com/maeda-m).

This project is [MIT](https://github.com/maeda-m/js2mermaid/blob/master/LICENSE) licensed.

***

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
