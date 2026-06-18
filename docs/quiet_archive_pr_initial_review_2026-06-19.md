# Quiet Archive PR Initial Review - 2026-06-19

## Status

運用開始。

実装対象:

- Stacklogs CTA / UTM / click tracking
- Quiet Archive CV event / funnel aggregation
- PR導線の運用Runbook

## Build Verification

| Repository | Command | Result | Notes |
| --- | --- | --- | --- |
| `/Users/zen/stacklog` | `npm run build` | Passed | Next.js workspace root warningあり。buildとsitemap生成は成功 |
| `/Users/zen/quiet-archive/quiet-archive` | `npm run build` | Passed | Next.js build成功 |

## Active URLs

| Stacklogs article | Quiet Archive intent | Status |
| --- | --- | --- |
| `/posts/back-office/smarthr-pricing-plan` | 料金変更・規約変更監視 | Active |
| `/posts/back-office/cloudsign-pricing-plan` | 料金変更・規約変更監視 | Active |
| `/posts/ai-saas/pdf-monitoring-automation` | PDF監視 | Active |
| `/posts/ai-saas/website-change-detection-tools-comparison` | Web変更検知 | Active |

## Tracking Contract

Stacklogs:

- Event: `cta_clicked`
- Required params: `cta_type`, `article_slug`, `article_category`, `position`, `destination_url`
- Quiet Archive CTA: `cta_type=quiet_archive`

UTM:

- `utm_source=stacklogs`
- `utm_medium=referral`
- `utm_campaign=quiet_archive_pr`
- `utm_content=article_[slug]_[position]...`

Quiet Archive:

- Signup CV: `qa_signup_complete`
- Activation: `monitor_created`
- Reference only: `signup_complete`

## Manual Checks To Run After Publish

| Check | Owner | Status |
| --- | --- | --- |
| 対象4記事が本番で200になる | Human | Pending |
| CTA URLに `quiet_archive_pr` UTMが入る | Human | Pending |
| Stacklogs GA4で `cta_clicked` が出る | Human | Pending |
| Quiet Archive GA4で `session source=stacklogs` が見える | Human | Pending |
| Quiet Archive GA4で `qa_signup_complete` が出る | Human | Pending |
| Quiet Archive GA4で `monitor_created` が出る | Human | Pending |

## Environment Limitation

この実行環境ではlocalhostへのHTTP接続が `connect EPERM` になるため、ブラウザでのローカルクリック検証は未実施。本番またはPreview URLでGA4 DebugView / Network payloadを確認する。

## First 24h Review

レビュー対象期間:

```text
2026-06-19 00:00 - 2026-06-20 00:00 Asia/Tokyo
```

記録欄:

| Article | CTA clicks | QA signups | Monitors created | Notes |
| --- | ---: | ---: | ---: | --- |
| SmartHR料金 |  |  |  |  |
| クラウドサイン料金 |  |  |  |  |
| PDF監視 |  |  |  |  |
| Web変更検知比較 |  |  |  |  |

