// VERIFY — free-crm-recommended | expected: 9192 chars, sha:bfe3967c
const b64 = window._b.join('');
const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
const decoded = new TextDecoder('utf-8').decode(bytes);
window._content = decoded;
const ok = decoded.length === 9192;
console.log(ok ? '✅ OK' : '❌ NG', 'length:', decoded.length, '(expected 9192)');
console.log('preview:', decoded.slice(0, 80));
ok ? '✅ verified' : ('❌ length mismatch: ' + decoded.length + ' vs 9192')
