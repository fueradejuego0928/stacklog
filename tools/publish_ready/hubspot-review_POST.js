// POST — hubspot-review → post_id:259
// ⚠️ VERIFY.js で length OK を確認してから実行
fetch('https://stacklogs.net/wp-json/wp/v2/posts/259', {
  method: 'POST',
  headers: {
    'X-WP-Nonce': wpApiSettings.nonce,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: window._content,
    slug: 'hubspot-review',
    status: 'publish',
    categories: [9],
    meta: {
      rank_math_description: "HubSpot\u306e\u8a55\u5224\u30fb\u53e3\u30b3\u30df\u3092\u30e6\u30fc\u30b6\u30fc\u76ee\u7dda\u3067\u6b63\u76f4\u89e3\u8aac\u3002\u30c7\u30e1\u30ea\u30c3\u30c8\u30fb\u5411\u3044\u3066\u3044\u306a\u3044\u4f01\u696d\u306e\u7279\u5fb4\u30fb\u7121\u6599\u30d7\u30e9\u30f3\u306e\u9650\u754c\u307e\u3067\u3002\u5c0e\u5165\u524d\u306b\u77e5\u3063\u3066\u304a\u304d\u305f\u3044\u30ea\u30a2\u30eb\u306a\u60c5\u5831\u3092\u307e\u3068\u3081\u307e\u3057\u305f\u3002",
      rank_math_focus_keyword: "HubSpot \u8a55\u5224"
    }
  })
}).then(r => r.json()).then(d => {
  console.log('✅ Published:', d.link, '| status:', d.status);
  window._postResult = d;
  '✅ ' + d.link
}).catch(e => '❌ ' + e)
