// VERIFY — smarthr-ryokin-plan | expected: 8412 chars, sha:808be83f
const b64 = window._b.join('');
const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
const decoded = new TextDecoder('utf-8').decode(bytes);
window._content = decoded;
const ok = decoded.length === 8412;
console.log(ok ? '✅ OK' : '❌ NG', 'length:', decoded.length, '(expected 8412)');
console.log('preview:', decoded.slice(0, 80));
ok ? '✅ verified' : ('❌ length mismatch: ' + decoded.length + ' vs 8412')
