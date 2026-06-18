# CTA Patterns — StackLog

## 記事タイプ別CTAパターン

### 比較記事：無料資料請求CTA

```html
<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">[サービス名]の資料を無料で請求する</div>
  <p class="sl-affiliate-cta-desc">機能・料金・導入事例をまとめた資料を無料でお届けします。</p>
  <a href="[アフィリエイトURL]" rel="nofollow" class="sl-btn-teal">無料資料請求 →</a>
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>
```

### レビュー記事：無料トライアルCTA

```html
<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">[サービス名]を無料で試す</div>
  <p class="sl-affiliate-cta-desc">クレジットカード不要。[期間]間、全機能を無料でお試しいただけます。</p>
  <a href="[アフィリエイトURL]" rel="nofollow" class="sl-btn-teal">無料トライアルを始める →</a>
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>
```

## 配置ルール

| 配置場所 | タイミング |
|---------|-----------|
| まとめボックス直下 | 記事冒頭（1件目） |
| H2セクション末尾 | 各サービス説明後 |
| 記事末尾（まとめ） | 最終CTA（最重要） |
| スティッキーサイドバー | TOC下のCTAウィジェット |

## ボタン文言バリエーション

比較記事：
- `無料資料請求 →`
- `比較資料を無料でもらう →`
- `[サービス名]の詳細を見る →`

レビュー記事：
- `無料トライアルを始める →`
- `[N]日間無料で試す →`
- `まずは無料で使ってみる →`

## デザイン仕様（Tealボタン）
```css
.sl-btn-teal {
  background: var(--teal);       /* #00B4A6 */
  color: var(--navy);            /* #0D1B3E */
  font-weight: 700;
  padding: 13px 28px;
  border-radius: 8px;
}
.sl-btn-teal:hover {
  background: #00c9b3;
  transform: translateY(-2px);
}
```

## 注意事項
- `rel="nofollow"` 必須
- PR表記（`.sl-pr-box`）は著者情報直後に必ず配置（省略禁止）
- 1記事の主CTAは1社に絞る（比較対象は控えめに）
