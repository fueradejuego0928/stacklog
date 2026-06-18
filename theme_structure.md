# Theme Structure — StackLog
# PHP/CSS開発時に @参照する

## カラーシステム（絶対遵守）

CSS変数は必ず以下を使う。ハードコード禁止。

```css
--navy:     #0D1B3E  /* メイン背景・テキスト */
--navy-mid: #162447
--navy-lt:  #1E3A5F
--teal:     #00B4A6  /* CTA・アクセント（多用禁止） */
--teal-dim: #007B75
--teal-lt:  #E0F7FA
--gold:     #C9933A  /* PR表記・バッジ */
--gold-lt:  #FFF8EC
--snow:     #F5F7FA  /* ページ背景 */
--gray200:  #E2E6EE
--gray600:  #5C6E88
--gray800:  #2D3A4A
--green:    #1E9B6B  /* 比較表✓ */
--red:      #E5534B  /* 比較表✗ */
```

## フォント（CSS変数で指定）

```css
--fs: 'Sora', 'Noto Sans JP', sans-serif  /* 見出し */
--fj: 'Noto Sans JP', sans-serif           /* 本文 */
--fm: 'JetBrains Mono', monospace          /* 数値・URL */
```

## テーマファイル構成

| ファイル | 役割 |
|---------|------|
| style.css | CSS変数・全コンポーネント |
| functions.php | Google Fonts・OGP・GA4・MailerLite・構造化データ |
| header.php | ロゴSVG・ナビ・検索フォーム・ハンバーガーメニュー |
| footer.php | 4カラム・Xリンク @stacklogs |
| index.php | Hero・Trust Strip・記事カードグリッド・カテゴリフィルター |
| archive.php | 記事一覧・フィルターバー・ページネーション |
| single.php | PR表記・まとめボックス・著者情報・TOC・関連記事 |
| page-ranking.php | ランキングページ（Template: ランキングページ） |
| author.php | 著者プロフィール・E-E-A-T実績・執筆記事一覧 |
| search.php | 検索結果ページ |
| 404.php | 404エラーページ |

## テスト・確認コマンド

```bash
# PHP構文チェック
php -l wp-content/themes/stacklog/functions.php

# カテゴリスラッグ確認
wp db query "SELECT name, slug FROM wp_terms t
INNER JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy = 'category';"

# 記事一覧確認
wp db query "SELECT ID, post_title, post_status, post_date
FROM wp_posts
WHERE post_status = 'publish'
AND post_type = 'post'
ORDER BY post_date DESC;"
```

## 既知のトラブルと対処法

| 問題 | 原因 | 対処法 |
|------|------|--------|
| 本番に記事が反映されない | DBはローカルのみ更新 | 本番管理画面から直接コードエディターで貼り付け |
| 投稿日時が過去になる | wp_insert_post()の日時未指定 | UPDATE文で当日に修正 |
| カテゴリフィルターが効かない | data-cat属性の値がスラッグと不一致 | wp_terms でスラッグを確認 |
| アイキャッチが縦横比崩れ | object-fit設定 | aspect-ratio: 16/9 + object-fit: cover |
