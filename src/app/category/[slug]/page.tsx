import { notFound } from "next/navigation";
import { getPostsByCategory, getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import TrackedLink from "@/components/TrackedLink";
import Link from "next/link";
import { CATEGORY_META, getCanonicalCategorySlug, getCategoryMeta } from "@/lib/categories";
import { getPillarPagesByCategory } from "@/lib/pillars";

const CATEGORY_CTA = {
  affiliate: {
    eventName: "affiliate_cta_click",
    label: "この業務フローに合うSaaSを比較する",
    href: "/posts?category=saas-comparison",
    className: "sl-btn-navy",
  },
  quiet_archive: {
    eventName: "cta_clicked",
    label: "Quiet Archiveで変更検知とAI要約を始める",
    href: "https://www.quietarchive.net/signup?utm_source=stacklogs&utm_medium=referral&utm_campaign=quiet_archive_pr&utm_content=category_monitoring_evidence_header_signup&utm_term=website_monitoring",
    className: "sl-btn-teal",
  },
  ai_consult: {
    eventName: "ai_consult_cta_click",
    label: "自社業務に合わせたAI活用フローを相談する",
    href: "https://www.quietarchive.net/contact?utm_source=stacklog&utm_medium=referral&utm_campaign=ai_consult&utm_content=category_contextual_cta",
    className: "sl-btn-navy",
  },
} as const;

function getCategoryCtaType(category: string): keyof typeof CATEGORY_CTA {
  const canonical = getCanonicalCategorySlug(category);
  if (canonical === "monitoring-evidence" || canonical === "quiet-archive-lab") return "quiet_archive";
  if (canonical === "ai-automation" || canonical === "workflow-design") return "ai_consult";
  return "affiliate";
}

export function generateStaticParams() {
  const categories = [
    ...new Set([...Object.keys(CATEGORY_META), ...getAllPosts().map((p) => p.category)]),
  ];
  return categories.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  return {
    title: `${meta.label}の記事一覧`,
    description: meta.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalCategorySlug(slug);
  const meta = CATEGORY_META[slug] ?? CATEGORY_META[canonicalSlug];
  if (!meta) notFound();
  const ctaType = getCategoryCtaType(slug);
  const cta = CATEGORY_CTA[ctaType];
  const relatedPillars = getPillarPagesByCategory(canonicalSlug).slice(0, 4);

  const posts = getPostsByCategory(slug);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-xs" style={{ color: 'var(--gray400)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--gray400)' }}>ホーム</Link>
        <span>/</span>
        <Link href="/posts" className="hover:underline" style={{ color: 'var(--gray400)' }}>記事一覧</Link>
        <span>/</span>
        <span style={{ color: 'var(--navy)' }}>{meta.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <span className="category-badge mb-3 inline-block">{meta.label}</span>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
          {meta.label}の記事一覧
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--gray400)' }}>
          {meta.description}（全{posts.length}記事）
        </p>
        {meta.priority !== "legacy" && (
          <div className="mt-5">
            <TrackedLink
              href={cta.href}
              target={cta.href.startsWith("http") ? "_blank" : undefined}
              rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={cta.className}
              eventName={cta.eventName}
              params={{
                article_slug: "category",
                article_category: canonicalSlug,
                cta_type: ctaType,
                cta_label: cta.label,
                destination_url: cta.href,
                position: "category_header",
              }}
            >
              {cta.label}
            </TrackedLink>
          </div>
        )}
      </div>

      {relatedPillars.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
            関連ピラーページ
          </h2>
          <div className="post-grid">
            {relatedPillars.map((pillar) => (
              <TrackedLink
                key={pillar.slug}
                href={`/pillars/${pillar.slug}`}
                className="block rounded-lg p-5 transition-colors hover:bg-[var(--snow)]"
                style={{ background: '#fff', border: '1px solid var(--gray200)' }}
                eventName="pillar_page_view"
                params={{
                  article_slug: "category",
                  article_category: canonicalSlug,
                  cta_type: "related_article",
                  cta_label: pillar.title,
                  destination_url: `/pillars/${pillar.slug}`,
                  position: "category_related_pillars",
                }}
              >
                <span className="category-badge mb-3 inline-block">
                  {getCategoryMeta(pillar.categorySlug).shortLabel}
                </span>
                <h3 className="text-sm font-bold leading-snug mb-2" style={{ color: 'var(--navy)' }}>
                  {pillar.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--gray400)' }}>
                  {pillar.description}
                </p>
              </TrackedLink>
            ))}
          </div>
        </section>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--gray400)' }}>記事はまだありません。</p>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
