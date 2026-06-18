// POST — smarthr-ryokin-plan → post_id:256
// ⚠️ VERIFY.js で length OK を確認してから実行
fetch('https://stacklogs.net/wp-json/wp/v2/posts/256', {
  method: 'POST',
  headers: {
    'X-WP-Nonce': wpApiSettings.nonce,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: window._content,
    slug: 'smarthr-ryokin-plan',
    status: 'publish',
    categories: [9],
    meta: {
      rank_math_description: "SmartHR\u306e\u6599\u91d1\u30d7\u30e9\u30f3\u3092\u5fb9\u5e95\u89e3\u8aac\u3002\u7121\u6599\u30c8\u30e9\u30a4\u30a2\u30eb\u306e\u5185\u5bb9\u3001\u5f93\u696d\u54e1\u898f\u6a21\u5225\u306e\u8cbb\u7528\u76ee\u5b89\u3001\u4ed6\u793e\u3068\u306e\u6bd4\u8f03\u307e\u3067\u3002\u5c0e\u5165\u524d\u306b\u77e5\u3063\u3066\u304a\u304d\u305f\u3044\u8cbb\u7528\u306e\u5168\u4f53\u50cf\u3092\u307e\u3068\u3081\u307e\u3057\u305f\u3002",
      rank_math_focus_keyword: "SmartHR \u6599\u91d1"
    }
  })
}).then(r => r.json()).then(d => {
  console.log('✅ Published:', d.link, '| status:', d.status);
  window._postResult = d;
  '✅ ' + d.link
}).catch(e => '❌ ' + e)
