# Quiet Archive / Stacklogs Analytics Event Spec

## Purpose

StacklogsからQuiet Archiveへの送客を、記事閲覧から登録完了、監視作成まで追えるようにする。

## Primary Conversion

- `qa_signup_complete`

Quiet Archiveの登録完了CVは `qa_signup_complete` を本命イベントとして判断する。旧 `signup_complete` は混線イベントとして扱い、CV判断には使わない。

## Funnel Events

- `page_view`
- `cta_clicked`
- `plan_selected`
- `signup_started`
- `qa_signup_complete`
- `monitor_created`

## Supporting Events

- `checkout_started`
- `paid_conversion`
- `enterprise_contact_submitted`

## Mixed / Reference Only

- `signup_complete`

`signup_complete` は旧イベントまたはGoogle tag由来の可能性があるため、Quiet Archiveの登録完了CV判断から外す。

## Stacklogs CTA Rule

Stacklogs上のQuiet Archive CTAクリックは `cta_clicked` に統一する。

Required parameters:

- `cta_type=quiet_archive`
- `article_slug`
- `article_category`
- `cta_label`
- `destination_url`
- `position`

StacklogsのGA4 Measurement IDは既存の `G-R38Z29TL4G` を維持する。Quiet Archive本体の `G-3C2ZBBGPLT` はStacklogs側には追加しない。

## Quiet Archive CV Rule

Quiet Archive本体側では、次のイベントでUTM継承を確認する。

- `plan_selected`
- `signup_started`
- `qa_signup_complete`
- `monitor_created`

`qa_signup_complete` には、可能な限り現在または保存済みのUTMとdebug markerを付与する。

Expected debug parameters:

- `debug_signup_complete_marker=quiet_archive_track_event_v2`
- `debug_signup_complete_source=signup_form`
- `debug_attribution_source=stored_or_current`

Quiet Archive本体リポジトリが特定できた後、Network payloadで `qa_signup_complete` と `monitor_created` の送信を別途検証する。
