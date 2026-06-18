export default function AuthorProfile() {
  return (
    <div
      className="mt-12 pt-8 rounded-xl p-6 flex items-start gap-4"
      style={{
        borderTop: '1px solid var(--gray200)',
        background: 'var(--snow)',
        border: '1px solid var(--gray200)',
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--navy)' }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: '#fff', fontFamily: 'var(--font-jetbrains)' }}
        >
          Y
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
            内藤善昭（Yoshi）
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: 'var(--teal-lt)', color: 'var(--teal-dim)' }}
          >
            著者
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--gray400)' }}>
          WEBディレクター・フロントエンジニア。HTML/CSS歴10年以上、React 2年。
          副業でURL監視SaaS「Quiet Archive」を開発・運営。
          AIツールと副業を実際に使いながら、役立つ情報を発信しています。
        </p>
      </div>
    </div>
  );
}
