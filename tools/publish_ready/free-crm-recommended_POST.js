// POST — free-crm-recommended → post_id:YOUR_POST_ID
// ⚠️ VERIFY.js で length OK を確認してから実行
fetch('https://stacklogs.net/wp-json/wp/v2/posts/YOUR_POST_ID', {
  method: 'POST',
  headers: {
    'X-WP-Nonce': wpApiSettings.nonce,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: window._content,
    slug: 'free-crm-recommended',
    status: 'publish',
    categories: [],
    meta: {
      rank_math_description: "",
      rank_math_focus_keyword: ""
    }
  })
}).then(r => r.json()).then(d => {
  console.log('✅ Published:', d.link, '| status:', d.status);
  window._postResult = d;
  '✅ ' + d.link
}).catch(e => '❌ ' + e)
