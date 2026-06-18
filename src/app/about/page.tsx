import Link from "next/link";

export const metadata = {
  title: "Stacklogsについて",
  description:
    "Stacklogsは、業務フローの改善・自動化・監視・証跡管理をテーマにしたWorkflow Intelligence Mediaです。",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
        このサイトについて
      </h1>

      <div className="prose">
        <h2>Stacklogsとは</h2>
        <p>
          Stacklogsは、業務フローの改善・自動化・監視・証跡管理をテーマにしたWorkflow Intelligence Mediaです。
          SaaS比較、AI活用、バックオフィス効率化、PDF・Web変更監視、Compliance Workflowを扱い、実務者が業務を整理し、適切なツールを選ぶための情報を提供します。
        </p>

        <h2>扱う領域</h2>
        <ul>
          <li>Workflow Design：業務フロー設計、業務改善、ツール選定フロー</li>
          <li>Back Office：会計、請求書、経費精算、人事労務、電子契約</li>
          <li>AI Automation：ChatGPT、Claude、Gemini、Dify、GAS、Zapier、Make</li>
          <li>Monitoring & Evidence：PDF監視、Web変更検知、規約変更監視、監査証跡</li>
          <li>SaaS Comparison：料金比較、評判・口コミ、導入前チェック</li>
          <li>Quiet Archive Lab：変更監視実践、PDF監視ワークフロー、Compliance Workflow実践</li>
        </ul>

        <h2>収益導線について</h2>
        <p>
          Stacklogsには、アフィリエイト収益、Quiet Archiveへの送客、AI業務改善・受託相談の導線があります。
          ただし、全記事で同じCTAを表示するのではなく、記事テーマに応じて自然な導線を出し分けます。
        </p>

        <h2>運営者について</h2>
        <p>
          内藤善昭（Yoshi）。WEBディレクター兼フロントエンジニアとして会社員をしながら、
          URL / PDF監視SaaS「Quiet Archive」を開発・運営しています。
          HTML/CSS歴10年以上、React 2年。変更検知、文書監視、AIを使った運用支援を実務目線で整理しています。
        </p>

        <h2>コンテンツポリシー</h2>
        <ul>
          <li>業務フロー、ワークフロー最適化、SaaS比較、AI自動化、変更監視、証跡管理を優先します</li>
          <li>比較記事では、向いているケース・向いていないケースの両方を記載します</li>
          <li>おすすめランキングでは、選定根拠や比較軸を明記します</li>
          <li>アフィリエイトリンクが含まれる場合は記事上部または下部に明示します</li>
          <li>Quiet Archiveを紹介する場合は、自社関連サービスであることを明記します</li>
          <li>情報が古くなった場合は随時更新します</li>
        </ul>

        <div className="sl-pr-box">
          この記事には広告・アフィリエイトリンクが含まれる場合があります。また、変更監視領域では関連サービスとしてQuiet Archiveを紹介することがあります。編集方針に基づき、向いているケース・向いていないケースの両方を記載します。
        </div>

        <h2>お問い合わせ</h2>
        <p>
          お問い合わせは{" "}
          <a
            href="https://www.quietarchive.net/?utm_source=stacklogs&utm_medium=referral&utm_campaign=quiet_archive_pr&utm_content=about_quiet_archive_contact&utm_term=website_monitoring"
            target="_blank"
            rel="noopener noreferrer"
            data-cta="about_quiet_archive_contact"
          >
            Quiet Archive
          </a>{" "}
          のお問い合わせページよりご連絡ください。
        </p>
      </div>

      <div className="mt-10">
        <Link href="/" className="text-sm" style={{ color: 'var(--teal)' }}>
          ← トップページへ
        </Link>
      </div>
    </div>
  );
}
