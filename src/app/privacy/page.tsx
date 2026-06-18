import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | Stacklog",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
        プライバシーポリシー
      </h1>

      <div className="prose">
        <h2>個人情報の取り扱いについて</h2>
        <p>
          Stacklog（以下「当サイト」）では、個人情報の保護を重視し、適切に管理します。
        </p>

        <h2>アクセス解析ツール</h2>
        <p>
          当サイトでは、Google Analyticsを使用してアクセス解析を行っています。
          Google Analyticsはデータ収集のためにCookieを使用しており、
          このデータは匿名で収集されます。
          詳しくは<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Googleのプライバシーポリシー</a>をご確認ください。
        </p>

        <h2>アフィリエイトプログラムについて</h2>
        <p>
          当サイトでは、アフィリエイトプログラムを利用しています。
          アフィリエイトリンクを経由して商品・サービスを購入された場合、
          当サイトに報酬が発生することがあります。
          該当記事には冒頭にPR表記を記載しています。
        </p>

        <h2>Cookieの使用について</h2>
        <p>
          当サイトでは、ユーザー体験向上のためにCookieを使用しています。
          ブラウザの設定からCookieの受け入れを拒否することができますが、
          一部のサービスが正常に動作しない場合があります。
        </p>

        <h2>お問い合わせ</h2>
        <p>プライバシーポリシーに関するお問い合わせは、当サイトのお問い合わせページよりご連絡ください。</p>

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
