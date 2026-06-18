# StackLog 収益化運用 Runbook

最終更新: 2026-05-28

## 目的

StackLog を「事業ワークフローでの問題・課題に着目したメディアサイト」として運用し、アフィリエイト収益 月30万〜50万円を狙う。

短期では以下を優先する。

1. 全記事に適切なCTAを設置する
2. ASPプレースホルダーをゼロにする
3. 高単価・承認済み案件へ記事導線を寄せる
4. 週次でGSC順位とCTA設置状況を監査する
5. 11〜30位の記事を優先してタイトル・CTA・内部リンクを改善する

## 現状サマリー

`npm run audit:monetization` のテストラン結果。

| 指標 | 現状 |
|---|---:|
| 本番公開記事数 | 102 |
| CTA未設置記事 | 24 |
| ASPプレースホルダー残存記事 | 8 |
| 本文混入・復旧が必要な記事 | 8 |

CTA未設置の多いカテゴリ。

| カテゴリ | 未設置数 | 対応方針 |
|---|---:|---|
| ai-tools | 9 | LINE WORKS AiNote / イルシルを設置 |
| monitoring | 5 | Quiet Archive CTAを設置 |
| pdf-monitoring | 3 | Quiet Archive CTAを設置 |
| vendor-procurement | 3 | Quiet Archive CTAを設置 |
| compliance-audit | 3 | Quiet Archive CTAを設置 |
| hr | 1 | Remoba労務を設置 |
| crm-ma | 1 | 暫定でLINE WORKS AiNote、HubSpot再申請後に差し替え |

## 承認済み・優先案件

| 案件 | 主な対象 | 報酬目安 | 優先度 |
|---|---|---:|---|
| LINE WORKS AiNote | AI業務改善、議事録、仕事効率化 | 5,000〜9,000円 | 高 |
| イルシル | AI資料作成、AIライティング、比較記事 | 5,000円 | 高 |
| FJORD BOOT CAMP | プログラミングスクール、副業、独立 | 5,000円 | 高 |
| Remoba労務 | 人事・労務、勤怠、給与、SmartHR系 | 要確認 | 中 |
| クラウドワークス テック | 副業・フリーランス、IT案件 | 2,000円 | 中 |
| freee / マネーフォワード | 会計・経費・給与 | 5,000〜10,000円 | 高 |
| 弥生 | 会計比較の補助選択肢 | 300〜2,000円 | 低 |

## 週次運用

### 1. 週次収益化レポート

```bash
cd /Users/zen/stacklog
npm run report:monetization
```

確認すること。

- `cta_coverage` が前週より下がっていないか
- `critical_content_or_placeholder` が 0 か
- `今週の優先アクション Top15` の上から順に修正できるか
- `カテゴリ別CTA未設置` で新しい穴が出ていないか
- 月30万円 / 月50万円に必要なCV数と、現在の導線不足の差分

### 2. 収益化監査

```bash
cd /Users/zen/stacklog
npm run audit:monetization
```

確認すること。

- `missing_cta` が増えていないか
- `placeholder_posts` が 0 か
- 新規投稿に `sl-affiliate-cta` が入っているか
- `href="#"` / `AFFILIATE_URL` / `PLACEHOLDER` が残っていないか

### 3. CTA修正 dry-run

```bash
cd /Users/zen/stacklog
npm run fix:monetization
```

dry-runで対象記事と割当CTAを確認する。

### 4. 本番反映

REST APIで更新する場合は環境変数を設定してから実行する。

```bash
export WP_USER="..."
export WP_APP_PASSWORD="..."
npm run fix:monetization -- --apply
```

Authorizationヘッダーが本番で通らない場合は、ヘテムル側 `.htaccess` に以下が必要。

```apache
RewriteRule ^ - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
```

REST更新が使えない場合は、本番PHP直実行方式を使う。アップロード後、実行後は必ず削除する。

```text
/Users/zen/stacklog/scripts/_fix_content_production.php
```

現在の収益化一括修正では、以下を使う。

```text
/Users/zen/stacklog/scripts/_monetization_production.php
```

現行生成物。

```text
size: 96K
sha256: 967c94ebf52ee591e958869561c2f56c7394280707cfca0fde03a2a1ea321906
```

生成。

```bash
cd /Users/zen/stacklog
npm run build:monetization-production
```

構文確認。

```bash
php -l scripts/_monetization_production.php
```

アップロード後の確認。

```bash
npm run check:monetization-production
```

ブラウザでの実行順。

```text
https://stacklogs.net/_monetization_production.php?mode=dry
https://stacklogs.net/_monetization_production.php?fix_auth=1&delete=1
```

dry-runで `failed: 0` になっていることを確認してから `fix_auth=1&delete=1` を実行する。
`fix_auth=1` を付けると、`.htaccess` に REST API 用の Authorization 転送ルールを追加する。
`delete=1` を付けると、本番反映後にPHPファイルが自己削除される。
実行後は必ず `npm run check:monetization-production` で404に戻ったことを確認する。

REST認証の診断。

```bash
npm run auth:wp
```

`/users/me` が `rest_not_logged_in` の場合、Application Password は送信されていても、Apache/PHPからWordPressへ Authorization ヘッダーが渡っていない。
この場合は上記の `fix_auth=1` を使う。

### 5. 反映後確認

```bash
npm run audit:monetization
npm run report:monetization
npm run gate:monetization
```

期待状態。

- `placeholder_posts: 0`
- `missing_cta` は 0 に近づける
- 追加したCTAの `rel="nofollow"` とPR表記が入っている

`gate:monetization` は以下の条件をすべて満たさない限り `FAIL` で終了する。

- `missing_cta <= 0`
- `placeholder_posts <= 0`
- `content_integrity_issues <= 0`

一時的にCTA未設置を許容して段階反映する場合だけ、明示的に閾値を指定する。

```bash
npm run gate:monetization -- --max-missing-cta=5
```

## 本文混入の復旧

副業系7本に、`crowdworks-vs-lancers-comparison` 用の本文断片とSQL断片が混入している。
加えて `crowdworks-vs-lancers-comparison` 本体に未確定ASPプレースホルダーが残っている。
URL差し替えだけでは品質リスクが残るため、ローカルMDXを正としてWordPress本文を復元する。

dry-run。

```bash
cd /Users/zen/stacklog
npm run restore:wp-content
```

本番反映。

```bash
export WP_USER="..."
export WP_APP_PASSWORD="..."
npm run restore:wp-content -- --apply
```

対象。

- `side-job-tax-return-how-much-company-employee`
- `side-job-recommended-company-employee`
- `side-job-not-found-out-company-employee`
- `saas-side-job-recommended`
- `programming-school-recommendations-for-working-adults`
- `freelance-web-director-income`
- `freelance-how-to-start-non-engineer`
- `crowdworks-vs-lancers-comparison`

復旧後、再度 `npm run audit:monetization` を実行し、`content_integrity_issues: 0` を確認する。

## 現在の修正候補

`npm run fix:monetization` dry-runで以下24本にCTA割当済み。

### Quiet Archive

- `pdf-document-monitoring`
- `contract-renewal-management`
- `regulation-change-monitoring`
- `procurement-approval-workflow`
- `vendor-requirement-change-workflow`
- `compliance-document-monitoring`
- `internal-audit-trail-risks`
- `web-tampering-detection-tools`
- `contract-update-management-system`
- `price-change-monitoring-tools`
- `terms-of-service-monitoring-automation`
- `url-monitoring-automation`
- `web-monitoring-tools-comparison`
- `pdf-monitoring-automation`

### AI案件

- `text-generation-ai-comparison` → イルシル
- `ai-writing-tools-comparison` → イルシル
- `ai-image-generation-tools-recommended` → イルシル
- `notion-ai-how-to-use` → LINE WORKS AiNote
- `free-ai-tools-work-efficiency` → LINE WORKS AiNote
- `dify-how-to-use-japanese` → LINE WORKS AiNote
- `chatgpt-pricing-personal-plan-guide` → LINE WORKS AiNote
- `ai-tools-recommended-side-job` → LINE WORKS AiNote
- `hubspot-crm-howto-guide-2` → LINE WORKS AiNote（暫定）

### HR

- `smarthr-howto-guide` → Remoba労務

## 手動レビューが必要な記事

以下8本は本番本文に `AFFILIATE_URL` / `PLACEHOLDER` 系文字列が残っている。
8本すべて、まず `restore:wp-content` で復旧する。

- `side-job-tax-return-how-much-company-employee`
- `side-job-recommended-company-employee`
- `side-job-not-found-out-company-employee`
- `saas-side-job-recommended`
- `programming-school-recommendations-for-working-adults`
- `freelance-web-director-income`
- `freelance-how-to-start-non-engineer`
- `crowdworks-vs-lancers-comparison`

`crowdworks-vs-lancers-comparison` は、承認済みのクラウドワークス テックを主CTAにし、ランサーズは通常リンクへ格下げしてプレースホルダーを解消済み。

## 月30万〜50万円への条件

概算条件。

| 月収目標 | 平均報酬 | 必要CV数/月 | 必要クリック数（CVR2%） | 必要記事PV（CTA CTR8%） |
|---:|---:|---:|---:|---:|
| 300,000円 | 5,000円 | 60 | 3,000 | 37,500 |
| 300,000円 | 8,000円 | 38 | 1,900 | 23,750 |
| 500,000円 | 5,000円 | 100 | 5,000 | 62,500 |
| 500,000円 | 8,000円 | 63 | 3,150 | 39,375 |

到達の現実的な順序。

1. 既存102本のCTA穴をゼロ化
2. GSCで11〜30位の記事をリライトしてCTR改善
3. 高単価カテゴリの記事群を内部リンクで束ねる
4. 承認済みASPを1記事1主CTAに整理
5. 月1,000訪問を超えたらHubSpot再申請

## 次のテストラン

1. `WP_USER` / `WP_APP_PASSWORD` を設定
2. RESTが通る場合: `npm run restore:wp-content -- --apply`
3. RESTが通る場合: `npm run fix:monetization -- --apply`
4. RESTが通らない場合: `npm run build:monetization-production`
5. RESTが通らない場合: `scripts/_monetization_production.php` をWordPressルートへアップロード
6. RESTが通らない場合: `https://stacklogs.net/_monetization_production.php?mode=dry`
7. RESTが通らない場合: `https://stacklogs.net/_monetization_production.php?fix_auth=1&delete=1`
8. `npm run auth:wp`
9. `npm run audit:monetization`
10. `npm run gate:monetization`
11. `content_integrity_issues: 0` / `placeholder_posts: 0` / `missing_cta: 0` を確認
