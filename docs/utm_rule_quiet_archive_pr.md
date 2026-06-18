# Quiet Archive PR UTM Rule

## Common Rule

Quiet Archive PR導線では、次のUTMを使う。

- `utm_source`: 流入元
- `utm_medium`: 流入種別
- `utm_campaign`: 施策名
- `utm_content`: 記事、投稿、CTA位置の識別子
- `utm_term`: 検索テーマ、訴求テーマ

## Stacklogs Template

```text
utm_source=stacklogs
utm_medium=referral
utm_campaign=quiet_archive_pr
utm_content=article_[slug]_[cta_position]
utm_term=[topic]
```

ArticleCTAでは、複数ボタンを識別するために末尾へCTA種別を付ける。

```text
article_[slug]_[cta_position]_signup_cta
article_[slug]_[cta_position]_tour_cta
article_[slug]_[cta_position]_pricing_terms_cta
```

Example:

```text
https://www.quietarchive.net/signup?utm_source=stacklogs&utm_medium=referral&utm_campaign=quiet_archive_pr&utm_content=article_pdf_monitoring_automation_bottom_signup&utm_term=pdf_monitoring
```

## Topic Terms

- `pdf_monitoring`: PDF監視、PDF差し替え、文書更新確認
- `website_monitoring`: Web変更検知、URL監視、Web監視
- `pricing_terms_monitoring`: 料金変更、規約変更、SaaS料金改定
- `compliance_monitoring`: 官公庁資料、法令、監査証跡

## SNS Template

X:

```text
utm_source=x
utm_medium=social
utm_campaign=quiet_archive_pr
utm_content=x_202606_post01
utm_term=website_monitoring
```

LinkedIn:

```text
utm_source=linkedin
utm_medium=social
utm_campaign=quiet_archive_pr
utm_content=linkedin_202606_post01
utm_term=compliance_monitoring
```

## Operational Notes

- `utm_campaign` はQuiet Archive PR施策では `quiet_archive_pr` に統一する。
- `utm_content` は記事slug、投稿ID、CTA位置が分かる名前にする。
- 既存の非PR導線は、必要がない限り無理に変更しない。
- CV判断では `qa_signup_complete` と `monitor_created` を見る。
- 旧 `signup_complete` はCV判断に使わない。
