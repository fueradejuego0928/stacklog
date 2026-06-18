import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCTA from "@/components/ArticleCTA";
import TrackedLink from "@/components/TrackedLink";
import { getCategoryMeta } from "@/lib/categories";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import { getPillarPage, PILLAR_PAGES } from "@/lib/pillars";
import type { PillarPage } from "@/lib/pillars";
import type { Post } from "contentlayer/generated";

function isPost(post: Post | undefined): post is Post {
  return Boolean(post);
}

function isPillarPage(page: PillarPage | undefined): page is PillarPage {
  return Boolean(page);
}

export function generateStaticParams() {
  return PILLAR_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPillarPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `https://stacklogs.net/pillars/${page.slug}`,
    },
  };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPillarPage(slug);
  if (!page) notFound();

  const explicitRelatedPosts = page.relatedPostSlugs
    .map((postSlug) => getPostBySlug(postSlug))
    .filter(isPost);
  const categoryRelatedPosts = page.relatedCategories
    .flatMap((category) => getPostsByCategory(category))
    .filter((post) => !page.relatedPostSlugs.includes(post.slug));
  const relatedPosts = [...explicitRelatedPosts, ...categoryRelatedPosts]
    .filter((post, index, posts) => posts.findIndex((candidate) => candidate?.slug === post?.slug) === index)
    .slice(0, 6);
  const relatedPillars = page.relatedPillarSlugs
    .map((pillarSlug) => getPillarPage(pillarSlug))
    .filter(isPillarPage);
  const categoryMeta = getCategoryMeta(page.categorySlug);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 mb-8 text-xs" style={{ color: 'var(--gray400)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--gray400)' }}>ホーム</Link>
        <span>/</span>
        <Link href="/posts" className="hover:underline" style={{ color: 'var(--gray400)' }}>記事一覧</Link>
        <span>/</span>
        <span style={{ color: 'var(--navy)' }}>{categoryMeta.label}</span>
      </nav>

      <article>
        <header className="mb-10">
          <span className="category-badge mb-4 inline-block">{categoryMeta.label}</span>
          <h1 className="text-3xl font-bold leading-tight mb-4" style={{ color: 'var(--navy)' }}>
            {page.title}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--gray400)' }}>
            {page.description}
          </p>
        </header>

        <div className="sl-pr-box">
          この記事には広告・アフィリエイトリンクが含まれる場合があります。また、変更監視領域では関連サービスとしてQuiet Archiveを紹介することがあります。編集方針に基づき、向いているケース・向いていないケースの両方を記載します。
        </div>

        <div className="prose">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        {relatedPillars.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
              関連ピラーページ
            </h2>
            <div className="post-grid">
              {relatedPillars.map((relatedPillar) => (
                <TrackedLink
                  key={relatedPillar.slug}
                  href={`/pillars/${relatedPillar.slug}`}
                  className="block rounded-lg p-5 transition-colors hover:bg-[var(--snow)]"
                  style={{ background: '#fff', border: '1px solid var(--gray200)' }}
                  eventName="pillar_page_view"
                  params={{
                    article_slug: `pillar/${page.slug}`,
                    article_category: page.categorySlug,
                    cta_type: "related_article",
                    cta_label: relatedPillar.title,
                    destination_url: `/pillars/${relatedPillar.slug}`,
                    position: "pillar_related_pillars",
                  }}
                >
                  <span className="category-badge mb-3 inline-block">
                    {getCategoryMeta(relatedPillar.categorySlug).shortLabel}
                  </span>
                  <h3 className="text-sm font-bold leading-snug mb-2" style={{ color: 'var(--navy)' }}>
                    {relatedPillar.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--gray400)' }}>
                    {relatedPillar.description}
                  </p>
                </TrackedLink>
              ))}
            </div>
          </section>
        )}

        <ArticleCTA
          articleSlug={`pillar/${page.slug}`}
          articleCategory={page.categorySlug}
          position="pillar_bottom"
        />
      </article>

      {relatedPosts.length > 0 && (
        <section className="mt-12 pt-8" style={{ borderTop: '1px solid var(--gray200)' }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--navy)' }}>
            関連記事
          </h2>
          <div className="post-grid">
            {relatedPosts.map((post) => (
              <TrackedLink
                key={post.slug}
                href={post.url}
                className="group block"
                eventName="related_article_click"
                params={{
                  article_slug: `pillar/${page.slug}`,
                  article_category: page.categorySlug,
                  cta_type: "related_article",
                  cta_label: post.title,
                  destination_url: post.url,
                  position: "pillar_related_posts",
                }}
              >
                <article className="post-card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="category-badge">
                      {getCategoryMeta(post.category).shortLabel}
                    </span>
                    <time className="text-xs" style={{ color: 'var(--gray400)' }}>
                      {new Date(post.date).toLocaleDateString("ja-JP")}
                    </time>
                  </div>
                  <h2 className="text-sm font-semibold leading-snug mb-2 transition-colors" style={{ color: 'var(--navy)' }}>
                    {post.title}
                  </h2>
                  <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--gray400)' }}>
                    {post.description}
                  </p>
                </article>
              </TrackedLink>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
