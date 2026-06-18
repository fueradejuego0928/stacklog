#!/usr/bin/env python3
"""
wp_publish.py — WordPress記事をブラウザfetch用JSに変換するヘルパー

使い方:
  python3 tools/wp_publish.py articles/your-article.html

出力:
  tools/publish_ready/your-article_chunk1.js  (コンソールに貼り付け実行)
  tools/publish_ready/your-article_chunk2.js  (存在する場合)
  tools/publish_ready/your-article_VERIFY.js  (デコード検証用)
  tools/publish_ready/your-article_POST.js    (最終POST用)

meta情報は articles/your-article.json に記述（任意）:
  {
    "post_id": 250,
    "slug": "your-article",
    "categories": [8],
    "status": "publish",
    "rank_math_description": "...",
    "rank_math_focus_keyword": "..."
  }
"""

import sys, os, base64, hashlib, json, textwrap

CHUNK_SIZE = 15000  # JS文字列として安全な1チャンクのbase64サイズ

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 tools/wp_publish.py articles/ARTICLE.html")
        sys.exit(1)

    html_path = sys.argv[1]
    base_name = os.path.splitext(os.path.basename(html_path))[0]
    out_dir = os.path.join(os.path.dirname(__file__), 'publish_ready')
    os.makedirs(out_dir, exist_ok=True)

    # HTMLファイル読み込み
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # メタ情報読み込み（同名.json があれば）
    meta_path = os.path.splitext(html_path)[0] + '.json'
    meta = {}
    if os.path.exists(meta_path):
        with open(meta_path, 'r', encoding='utf-8') as f:
            meta = json.load(f)

    post_id   = meta.get('post_id', 'YOUR_POST_ID')
    slug      = meta.get('slug', base_name)
    cats      = meta.get('categories', [])
    status    = meta.get('status', 'publish')
    rm_desc   = meta.get('rank_math_description', '')
    rm_kw     = meta.get('rank_math_focus_keyword', '')

    # base64エンコード
    b64 = base64.b64encode(content.encode('utf-8')).decode('ascii')
    sha = hashlib.sha256(content.encode('utf-8')).hexdigest()[:8]
    char_count = len(content)

    print(f"\n{'='*50}")
    print(f"  記事: {html_path}")
    print(f"  文字数: {char_count:,} chars")
    print(f"  base64: {len(b64):,} chars")
    print(f"  SHA256(8): {sha}")
    print(f"  チャンク数: {(len(b64) - 1) // CHUNK_SIZE + 1}")
    print(f"{'='*50}\n")

    # チャンク分割
    chunks = textwrap.wrap(b64, CHUNK_SIZE)
    n = len(chunks)

    # --- chunk_N.js 生成 ---
    for i, chunk in enumerate(chunks):
        js = f"""// StackLog WP Publisher — {base_name}
// Chunk {i+1}/{n} | SHA:{sha}
// このコードをWordPress管理画面のコンソールで実行
{'if (!window._b) window._b = [];' if i == 0 else ''}
window._b.push("{chunk}");
console.log('chunk {i+1}/{n} pushed. total:', window._b.length);
"""
        out_path = os.path.join(out_dir, f'{base_name}_chunk{i+1}.js')
        with open(out_path, 'w') as f:
            f.write(js)
        print(f"  ✅ {out_path}")

    # --- VERIFY.js 生成 ---
    verify_js = f"""// VERIFY — {base_name} | expected: {char_count} chars, sha:{sha}
const b64 = window._b.join('');
const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
const decoded = new TextDecoder('utf-8').decode(bytes);
window._content = decoded;
const ok = decoded.length === {char_count};
console.log(ok ? '✅ OK' : '❌ NG', 'length:', decoded.length, '(expected {char_count})');
console.log('preview:', decoded.slice(0, 80));
ok ? '✅ verified' : ('❌ length mismatch: ' + decoded.length + ' vs {char_count}')
"""
    verify_path = os.path.join(out_dir, f'{base_name}_VERIFY.js')
    with open(verify_path, 'w') as f:
        f.write(verify_js)
    print(f"  ✅ {verify_path}")

    # --- POST.js 生成 ---
    cats_json = json.dumps(cats)
    post_js = f"""// POST — {base_name} → post_id:{post_id}
// ⚠️ VERIFY.js で length OK を確認してから実行
fetch('https://stacklogs.net/wp-json/wp/v2/posts/{post_id}', {{
  method: 'POST',
  headers: {{
    'X-WP-Nonce': wpApiSettings.nonce,
    'Content-Type': 'application/json'
  }},
  body: JSON.stringify({{
    content: window._content,
    slug: '{slug}',
    status: '{status}',
    categories: {cats_json},
    meta: {{
      rank_math_description: {json.dumps(rm_desc)},
      rank_math_focus_keyword: {json.dumps(rm_kw)}
    }}
  }})
}}).then(r => r.json()).then(d => {{
  console.log('✅ Published:', d.link, '| status:', d.status);
  window._postResult = d;
  '✅ ' + d.link
}}).catch(e => '❌ ' + e)
"""
    post_path = os.path.join(out_dir, f'{base_name}_POST.js')
    with open(post_path, 'w') as f:
        f.write(post_js)
    print(f"  ✅ {post_path}")

    print(f"""
手順:
  1. WP管理画面を開きコンソール(F12)を起動
  2. chunk1.js ～ chunk{n}.js を順に実行
  3. VERIFY.js で '✅ verified' を確認
  4. POST.js を実行
""")

if __name__ == '__main__':
    main()
