# StackLog WordPress開発 — Claude Code設定

## プロジェクト概要

- **サイト名**: StackLog（SaaS比較・導入ガイドメディア）
- **URL**: https://stacklogs.net
- **ローカル**: http://stacklogs.local
- **構成**: WordPress + 独自テーマ（stacklog）
- **目的**: BtoB SaaSアフィリエイトメディア
- **独立判断マイルストーン**: 2026年9月（月収10〜20万円目標）
- **仕様書**: @stacklog_dev_spec.md を常に参照すること

---

## サーバー・インフラ

| 項目 | 内容 |
|------|------|
| 本番サーバー | ヘテムル |
| ドメイン管理 | お名前.com |
| ローカル開発 | Local by Flywheel |
| テーマパス（ローカル） | ~/Local Sites/stacklogs/app/public/wp-content/themes/stacklog/ |
| デプロイ方法 | Cyberduck → ヘテムルFTP |
| FTPパス | /www/[ユーザー名]/html/wp-content/themes/stacklog/ |

---

## 開発ルール

- PHP変更後は必ず `php -l` で構文チェックを実行
- CSSクラス名は `sl-` プレフィックスを使う（例: `.sl-btn-teal`）
- PR表記ボックスは全記事に必ず含める（`.sl-pr-box`）
- 比較テーブルは `[sl_compare type="xxx"]` ショートコードで設置
- 記事投稿後は必ず投稿日時を当日に設定する

## 禁止事項

- テーマのコアファイルを直接編集しない
- インラインスタイルを使わない（CSSクラスを作る）
- !important の使用は最終手段のみ
- APIキーをターミナルやチャットに直接貼り付けない

---

## 著者情報

| 著者 | 担当カテゴリ |
|------|------------|
| 松本 浩二（編集長） | 会計・経費精算・電子契約 |
| 中島 健太 | 人事・労務 |

---

## カテゴリ構成

| カテゴリ名 | スラッグ |
|-----------|---------|
| 会計・経費精算 | accounting |
| 人事・労務 | hr |
| 電子契約 | contract |
| CRM・MA | crm-ma |

---

## 記事投稿ルール

1. `wp_insert_post()` で投稿
2. 投稿日時を当日に設定（UPDATE文で修正）
3. カテゴリはスラッグで指定（accounting/hr/contract/crm-ma）
4. 投稿後: メタディスクリプション・アイキャッチ・CTA・インデックスリクエスト

---

## Git規約

- コミットメッセージ: feat/fix/style/docs + 日本語説明
- 例: `feat: ヘッダーにStackLogロゴSVGを実装`
- ブランチ: main

---

## 参照ファイル一覧

| ファイル | 使うタイミング |
|---------|--------------|
| @theme_structure.md | PHP/CSS開発・カラー・ファイル構成確認時 |
| @seo_rules.md | 記事作成・タイトル・構成設計時 |
| @cta_patterns.md | CTA実装・ボタン文言・配置設計時 |
| @affiliate_programs.md | ASP案件確認・リンク設置時 |
| @monthly_tasks.md | 月次レビュー・タスク・計測ツール確認時 |
| @stacklog_dev_spec.md | UI仕様・コンポーネント詳細確認時 |
