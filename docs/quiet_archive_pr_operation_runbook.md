# Quiet Archive PR Operation Runbook

## 目的

Stacklogs記事からQuiet Archiveへの送客を、公開直後から週次で改善できる状態にする。

対象:

- Stacklogs記事内CTA
- Quiet Archive到達URLのUTM
- Stacklogs側 `cta_clicked`
- Quiet Archive側 `qa_signup_complete`
- Quiet Archive側 `monitor_created`

## 運用開始日

- 2026-06-19

## 対象記事

| Article | Intent | Primary CTA position | UTM term | Status |
| --- | --- | --- | --- | --- |
| `/posts/back-office/smarthr-pricing-plan` | SaaS料金・無料/有料プラン確認 | `article_bottom`, `article_sidebar` | `pricing_terms_monitoring` | Active |
| `/posts/back-office/cloudsign-pricing-plan` | SaaS料金・無料/有料プラン確認 | `article_bottom`, `article_sidebar` | `pricing_terms_monitoring` | Active |
| `/posts/ai-saas/pdf-monitoring-automation` | PDF監視・文書更新確認 | `intro_signup`, `bottom_signup`, `article_bottom`, `article_sidebar` | `pdf_monitoring` | Active |
| `/posts/ai-saas/website-change-detection-tools-comparison` | Web変更検知・URL監視比較 | `article_bottom`, `article_sidebar` | `website_monitoring` | Active |

## 公開前チェック

1. `npm run build` が成功している
2. Quiet Archive CTAの `utm_source` が `stacklogs` である
3. `utm_medium=referral` である
4. `utm_campaign=quiet_archive_pr` である
5. `utm_content=article_[slug]_[position]...` 形式で記事とCTA位置を識別できる
6. Stacklogs側クリックイベントが `cta_clicked` で送られる
7. `cta_type=quiet_archive` が入る
8. `article_slug`, `article_category`, `position`, `destination_url` が入る
9. Quiet Archive本体側の登録完了CVは `qa_signup_complete` を見る
10. 旧 `signup_complete` は参考扱いにする

## 公開直後チェック

公開後30分以内に確認する。

| Check | Expected | Result | Action |
| --- | --- | --- | --- |
| 対象4記事が200で開く | 200 |  |  |
| 記事末CTAが表示される | Visible |  |  |
| サイドバーCTAが表示される | Visible on desktop |  |  |
| CTA URLに `utm_source=stacklogs` がある | Yes |  |  |
| CTA URLに `utm_campaign=quiet_archive_pr` がある | Yes |  |  |
| CTAクリックでQuiet Archiveへ遷移する | Yes |  |  |
| Stacklogs GA4で `cta_clicked` が出る | Yes |  |  |
| Quiet Archive GA4で流入UTMが保持される | Yes |  |  |

## 初回24時間レビュー

GA4で以下を見る。

| Metric | Segment | Target | Next action |
| --- | --- | ---: | --- |
| `cta_clicked` | `cta_type=quiet_archive` | 1件以上 | 0ならCTA表示/クリック計測を確認 |
| Quiet Archive sessions | `utm_campaign=quiet_archive_pr` | 1件以上 | 0なら遷移URLとUTMを確認 |
| `qa_signup_complete` | `utm_campaign=quiet_archive_pr` | 発生有無を見る | 0でも初日は許容 |
| `monitor_created` | `utm_campaign=quiet_archive_pr` | 発生有無を見る | 0でも初日は許容 |

## 週次レビュー

毎週1回、対象期間は直近7日で見る。

| Article | CTA clicks | QA signups | Monitors created | Signup rate | Monitor rate | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| SmartHR料金 |  |  |  |  |  |  |
| クラウドサイン料金 |  |  |  |  |  |  |
| PDF監視 |  |  |  |  |  |  |
| Web変更検知比較 |  |  |  |  |  |  |

計算:

```text
Signup rate = qa_signup_complete / cta_clicked
Monitor rate = monitor_created / cta_clicked
```

判断:

- `cta_clicked` が少ない: CTA位置、記事内導入文、関連記事リンクを改善する
- `cta_clicked` はあるが `qa_signup_complete` が少ない: Quiet Archive到達ページ、ファーストビュー、登録CTAを確認する
- `qa_signup_complete` はあるが `monitor_created` が少ない: Onboardingの入力例、初回登録URLの説明を改善する
- SaaS料金記事のCVが弱い: Quiet Archiveを強く売らず、「料金変更・規約変更を見逃さない」文脈を増やす
- PDF/Web監視記事のCVが弱い: 監視対象例、証跡、通知、比較表からの導線を増やす

## GA4探索条件

Stacklogs側:

```text
event_name = cta_clicked
cta_type = quiet_archive
utm_campaign = quiet_archive_pr
```

Quiet Archive側:

```text
session campaign = quiet_archive_pr
event_name IN (plan_selected, qa_signup_complete, monitor_created, checkout_started, paid_conversion, enterprise_contact_submitted)
```

## Search Console確認

対象記事ごとに以下を見る。

- Clicks
- Impressions
- CTR
- Average position
- Query

優先query:

- `smarthr 料金`
- `smarthr 無料プラン`
- `クラウドサイン 料金`
- `クラウドサイン 無料プラン`
- `pdf 監視`
- `pdf 更新 検知`
- `web 変更検知 ツール`
- `url 監視 ツール`

## 改善バックログ

| Priority | Task | Condition |
| --- | --- | --- |
| P0 | 対象4記事のCTA URL不備修正 | UTMまたは遷移先が壊れている |
| P0 | `cta_clicked` 計測修正 | Stacklogs GA4にクリックが出ない |
| P0 | `qa_signup_complete` 確認 | Quiet Archive GA4に登録完了が出ない |
| P1 | 料金記事の末尾CTA文言改善 | CTA clicksが少ない |
| P1 | PDF/Web監視記事の本文中CTA追加 | 記事閲覧はあるがクリックが少ない |
| P1 | Onboarding改善 | signupはあるがmonitorが少ない |
| P2 | 未作成記事の移行/新規作成 | 既存4記事の初回反応確認後 |

