import Link from "next/link";

export const metadata = {
  title: "免責事項 | Stacklog",
};

export default function PolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
        免責事項
      </h1>

      <div className="prose">
        <h2>情報の正確性について</h2>
        <p>
          当サイトのコンテンツは、執筆時点の情報に基づいています。
          ツールやサービスの仕様・価格は変更される場合があり、
          最新情報は各サービスの公式サイトをご確認ください。
        </p>

        <h2>損害等の責任について</h2>
        <p>
          当サイトに掲載されている情報を参考に行動された結果として生じた損害・損失について、
          当サイトは一切の責任を負いません。
          最終的な判断はご自身の責任において行ってください。
        </p>

        <h2>外部リンクについて</h2>
        <p>
          当サイトから外部サイトへのリンクを含む場合がありますが、
          リンク先のコンテンツや情報については当サイトは管理・保証しません。
        </p>

        <h2>著作権について</h2>
        <p>
          当サイトのコンテンツ（テキスト・画像等）の著作権は当サイト運営者に帰属します。
          無断での転載・複製はお断りします。
        </p>

        <p className="text-sm" style={{ color: 'var(--gray400)' }}>制定日：2026年4月25日</p>
      </div>

      <div className="mt-10">
        <Link href="/" className="text-sm" style={{ color: 'var(--teal)' }}>
          ← トップページへ
        </Link>
      </div>
    </div>
  );
}
