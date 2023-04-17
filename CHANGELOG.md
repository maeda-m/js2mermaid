# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased](https://github.com/maeda-m/js2mermaid/compare/v0.9.2...HEAD)

## [0.9.2](https://github.com/maeda-m/js2mermaid/compare/v0.9.1...v0.9.2) - 2023-04-17

### Changed

- コールグラフにおいてプロパティの呼び出しは未対応のため、出力対象外とした

### Fixed

- this をレシーバーにしたプロパティ経由のメソッドの誤検知を修正した

## [0.9.1](https://github.com/maeda-m/js2mermaid/compare/v0.9.0...v0.9.1) - 2022-10-13

- `npm publish` のためにバージョン表記のみ更新

## [0.9.0](https://github.com/maeda-m/js2mermaid/commits/v0.9.0) - 2022-10-12

[FJORD BOOT CAMP（フィヨルドブートキャンプ）](https://bootcamp.fjord.jp/) にて npm パッケージ作成課題の提出物として作成しました。

### Added

- コールグラフの出力機能を実装した
  - es2015 以降のクラス宣言と名前つきクラス式のクラス本体とメソッド定義、this をレシーバーにしたメソッド呼び出しを解析して出力します
- クラス図の出力機能を実装した
  - es2015 以降のクラス宣言と名前つきクラス式のクラス本体とメソッド定義、プロパティ、フィールドを解析して出力します
