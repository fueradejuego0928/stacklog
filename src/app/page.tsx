import Link from "next/link";
import { getAllPosts, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { getCategoryMeta } from "@/lib/categories";
import { PILLAR_PAGES } from "@/lib/pillars";

const workflowCards = [
  {
    title: "Monitoring & Evidence",
    category: "monitoring-evidence",
    visual: "pdf",
    pain: "同じURLや同じファイル名のままPDFが差し替わると、担当者の目視確認だけでは判断根拠が古くなります。",
    useCase: "制度資料、料金表、仕様書、監査資料を継続監視し、Before / Afterと更新履歴を残す。",
    href: "/posts?category=monitoring-evidence",
    cta: "このPDFを監視する",
  },
  {
    title: "Back Office",
    category: "back-office",
    visual: "compliance",
    pain: "会計、契約、人事労務の業務は、ツール選定だけでなく承認、確認、証跡の流れまで設計が必要です。",
    useCase: "電子契約、経費精算、請求、労務管理のSaaS比較と導入前チェックを整理する。",
    href: "/posts?category=back-office",
    cta: "SaaS比較を見る",
  },
  {
    title: "AI Automation",
    category: "ai-automation",
    visual: "vendor",
    pain: "AIツールを単体で入れても、入力、確認、通知、レポート化の流れがないと現場に定着しません。",
    useCase: "ChatGPT、Claude、Gemini、Dify、GASを業務フローに組み込む設計を扱う。",
    href: "/posts?category=ai-automation",
    cta: "AI自動化を見る",
  },
  {
    title: "Quiet Archive Lab",
    category: "quiet-archive-lab",
    visual: "ai",
    pain: "PDF監視、規約変更、監査証跡は、読んで終わりではなく継続運用に接続して初めて価値が出ます。",
    useCase: "Quiet Archiveを使った変更監視、AI要約、履歴保存、Compliance Workflow実践を扱う。",
    href: "/posts?category=quiet-archive-lab",
    cta: "監視Workflowを見る",
  },
];

const operationalKeywords = [
  "PDF monitoring",
  "regulation change monitoring",
  "vendor requirement monitoring",
  "audit workflow",
  "operational monitoring",
];

function uniquePosts<T extends { slug: string }>(posts: T[]): T[] {
  return [...new Map(posts.map((post) => [post.slug, post])).values()];
}

export default function HomePage() {
  const allPosts = getAllPosts();
  const workflowPosts = allPosts.filter((post) => getCategoryMeta(post.category).priority !== "legacy");
  const featuredPost = workflowPosts[0] ?? allPosts[0];
  const recentPosts = workflowPosts.slice(1, 7);
  const pdfPosts = getPostsByCategory("monitoring-evidence").slice(0, 3);
  const compliancePosts = getPostsByCategory("quiet-archive-lab").slice(0, 3);
  const operationalPosts = uniquePosts([
    ...getPostsByCategory("saas-comparison"),
    ...getPostsByCategory("ai-automation"),
    ...getPostsByCategory("workflow-design"),
    ...getPostsByCategory("back-office"),
  ]).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="hero-grid">
            <div className="max-w-2xl">
            <p
              className="text-xs font-semibold mb-4 tracking-widest uppercase"
              style={{ color: 'var(--teal)' }}
            >
              Workflow Intelligence Media
            </p>
            <h1
              className="hero-title"
              style={{ color: '#fff', fontFamily: 'var(--font-inter)' }}
            >
              Workflow Intelligence Media
            </h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
              業務フローを、SaaS・AI・自動化・変更監視で最適化する。Stacklogsは、会計・契約・人事労務・AI活用・PDF監視・Web変更検知まで、業務フローの改善に必要なツールと運用設計を整理するメディアです。
            </p>
            <div className="hero-actions">
              <Link href="/posts?category=monitoring-evidence" className="sl-btn-teal" data-cta="home_hero_monitoring_evidence">
                変更監視を知る
              </Link>
              <Link
                href="/posts"
                className="text-sm"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                data-cta="home_hero_workflow_articles"
              >
                Workflow記事を見る →
              </Link>
            </div>
            </div>
            <div className="workflow-visual" aria-label="Operational monitoring workflow dashboard">
              <div className="ops-panel-head">
                <div>
                  <span>Monitor</span>
                  <strong>Compliance PDF / Vendor Portal</strong>
                </div>
                <em>09:42 synced</em>
              </div>
              <div className="ops-dashboard">
                <div className="ops-document">
                  <div className="ops-doc-label">PDF before</div>
                  <span className="visual-line w-4/5" />
                  <span className="visual-line w-2/3" />
                  <span className="visual-line w-3/4 muted" />
                </div>
                <div className="ops-document changed">
                  <div className="ops-doc-label">PDF after</div>
                  <span className="visual-line w-4/5" />
                  <span className="visual-line w-2/3 highlight" />
                  <span className="visual-line w-3/4 muted" />
                </div>
                <div className="ops-notification">
                  <span>Notification</span>
                  <strong>Vendor requirement updated</strong>
                  <small>Notify: Legal Ops / Procurement</small>
                </div>
                <div className="ops-summary">
                  <span>AI summary</span>
                  <p>提出期限と添付資料の条件が更新されました。レビュー担当へ確認を依頼します。</p>
                </div>
              </div>
              <div className="ops-timeline">
                <span className="done">Detect</span>
                <span className="done">Diff</span>
                <span className="active">Summarize</span>
                <span>Review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ops-strip">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-8 overflow-x-auto">
            {[
              "workflow problem first",
              "SaaS comparison",
              "AI automation",
              "Monitoring & Evidence",
            ].map((item) => (
              <span key={item} className="text-xs font-semibold whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Workflow Problem Cards */}
        <section className="mb-16">
          <div className="section-heading">
            <p className="section-kicker">Workflow Problems</p>
            <h2>運用課題から記事クラスタへ入る</h2>
          </div>
          <div className="workflow-card-grid">
            {workflowCards.map((card) => (
              <Link key={card.title} href={card.href} className="workflow-card" data-cta={`home_problem_${card.category}`}>
                <div className={`workflow-card-visual visual-${card.visual}`} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="category-badge">{getCategoryMeta(card.category).label}</span>
                <h3>{card.title}</h3>
                <p>{card.pain}</p>
                <small>{card.useCase}</small>
                <strong>{card.cta} →</strong>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>Workflow Intelligence 最新記事</h2>
            </div>
            <Link href={featuredPost.url} className="group block">
              <div
                className="featured-article"
                style={{
                  background: '#fff',
                  border: '1px solid var(--gray200)',
                  boxShadow: 'var(--sh2)',
                  transition: 'box-shadow 0.15s',
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="category-badge">
                      {getCategoryMeta(featuredPost.category).label}
                    </span>
                    <time className="text-xs" style={{ color: 'var(--gray400)' }}>
                      {new Date(featuredPost.date).toLocaleDateString("ja-JP")}
                    </time>
                  </div>
                  <h3
                    className="text-xl font-bold leading-snug mb-3 group-hover:underline"
                    style={{ color: 'var(--navy)' }}
                  >
                    {featuredPost.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--gray400)' }}>
                    {featuredPost.description}
                  </p>
                  <span className="text-sm font-semibold" style={{ color: 'var(--teal)' }}>
                    workflowを理解する →
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Recent Posts Grid */}
        {recentPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>Operational Intelligence</h2>
              <Link href="/posts" className="text-sm font-medium" style={{ color: 'var(--teal)' }}>
                すべて見る →
              </Link>
            </div>
            <div className="post-grid">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Category Sections */}
        <div className="home-cluster-grid mb-16">
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ color: 'var(--navy)' }}>
                PDF / Compliance Workflows
              </h2>
              <Link href="/posts?category=monitoring-evidence" className="text-xs font-medium" style={{ color: 'var(--teal)' }}>
                一覧 →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {uniquePosts([...pdfPosts, ...compliancePosts]).slice(0, 4).map((post) => (
                <Link key={post.slug} href={post.url} className="group flex gap-3 items-start">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium leading-snug group-hover:underline line-clamp-2"
                      style={{ color: 'var(--navy)' }}
                    >
                      {post.title}
                    </p>
                    <time className="text-xs mt-1 block" style={{ color: 'var(--gray400)' }}>
                      {new Date(post.date).toLocaleDateString("ja-JP")}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ color: 'var(--navy)' }}>
                Comparison / Use Case
              </h2>
              <Link href="/posts?category=ai-automation" className="text-xs font-medium" style={{ color: 'var(--teal)' }}>
                一覧 →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {operationalPosts.map((post) => (
                <Link key={post.slug} href={post.url} className="group flex gap-3 items-start">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium leading-snug group-hover:underline line-clamp-2"
                      style={{ color: 'var(--navy)' }}
                    >
                      {post.title}
                    </p>
                    <time className="text-xs mt-1 block" style={{ color: 'var(--gray400)' }}>
                      {new Date(post.date).toLocaleDateString("ja-JP")}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
              Pillar Pages
            </h2>
            <Link href="/pillars" className="text-sm font-medium" style={{ color: 'var(--teal)' }}>
              すべて見る →
            </Link>
          </div>
          <div className="post-grid">
            {PILLAR_PAGES.slice(0, 6).map((page) => (
              <Link
                key={page.slug}
                href={`/pillars/${page.slug}`}
                className="block rounded-lg p-5 transition-colors hover:bg-[var(--snow)]"
                style={{ background: '#fff', border: '1px solid var(--gray200)' }}
              >
                <span className="category-badge mb-3 inline-block">
                  {getCategoryMeta(page.categorySlug).shortLabel}
                </span>
                <h3 className="text-sm font-bold leading-snug mb-2" style={{ color: 'var(--navy)' }}>
                  {page.title}
                </h3>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--gray400)' }}>
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="quiet-archive-band">
          <div>
            <p className="section-kicker">Workflow Continuation</p>
            <h2>記事で理解した変更監視を、そのまま運用フローに接続する</h2>
            <p>
              Stacklogsの記事は、workflow problemの理解からQuiet Archiveでの監視作成までをつなぐために設計しています。PDF、法改正、vendor requirement、監査資料の変化を検知し、要約し、レビューへ渡すところまでを一つの流れとして扱います。
            </p>
            <div className="keyword-row">
              {operationalKeywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          </div>
          <div className="quiet-archive-actions">
            <a
              href="https://www.quietarchive.net/signup?utm_source=stacklogs&utm_medium=referral&utm_campaign=quiet_archive_pr&utm_content=home_workflow_intelligence_signup&utm_term=website_monitoring"
              target="_blank"
              rel="noopener noreferrer"
              className="sl-btn-teal"
              data-cta="home_quiet_archive_signup"
            >
              このPDFを監視する
            </a>
            <a
              href="https://www.quietarchive.net/product-tour?utm_source=stacklogs&utm_medium=referral&utm_campaign=quiet_archive_pr&utm_content=home_workflow_intelligence_product_tour&utm_term=website_monitoring"
              target="_blank"
              rel="noopener noreferrer"
              className="sl-btn-navy"
              data-cta="home_quiet_archive_tour"
            >
              変更をAIで要約する
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
