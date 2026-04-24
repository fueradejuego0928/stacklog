export default function AuthorProfile() {
  return (
    <div className="mt-12 pt-8 border-t border-zinc-800">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
          <span className="text-sm font-mono font-semibold text-zinc-300">Y</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-zinc-200">内藤善昭（Yoshi）</span>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 font-mono">
              著者
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            WEBディレクター・フロントエンジニア。HTML/CSS歴10年以上、React 2年。
            副業でURL監視SaaS「Quiet Archive」を開発・運営。
            AIツールと副業を実際に使いながら、役立つ情報を発信しています。
          </p>
        </div>
      </div>
    </div>
  );
}
