import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/posts";
import { useMDXComponent } from "next-contentlayer2/hooks";
import AuthorProfile from "@/components/AuthorProfile";
import ArticleCTA from "@/components/ArticleCTA";
import TrackedLink from "@/components/TrackedLink";
import { getCanonicalCategorySlug, getCategoryMeta, PRIMARY_CATEGORY_SLUGS } from "@/lib/categories";
import { getPillarPagesByCategory } from "@/lib/pillars";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug.join("/"));
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://stacklogs.net${post.url}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://stacklogs.net${post.url}`,
    },
  };
}

function PostContent({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code);
  return (
    <div className="prose">
      {/* eslint-disable-next-line react-hooks/static-components */}
      <MDXContent />
    </div>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug.join("/"));
  if (!post) notFound();
  const relatedPosts = getRelatedPosts(post);
  const categoryMeta = getCategoryMeta(post.category);
  const canonicalCategorySlug = getCanonicalCategorySlug(post.category);
  const relatedPillars = getPillarPagesByCategory(canonicalCategorySlug).slice(0, 3);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "内藤善昭（Yoshi）",
    },
    publisher: {
      "@type": "Organization",
      name: "Stacklogs",
      url: "https://stacklogs.net",
    },
    mainEntityOfPage: `https://stacklogs.net${post.url}`,
    articleSection: categoryMeta.label,
    keywords: post.tags.join(", "),
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="flex gap-12">

        {/* Main Content */}
        <article className="flex-1 min-w-0">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs" style={{ color: 'var(--gray400)' }}>
            <Link href="/" style={{ color: 'var(--gray400)' }} className="hover:underline">
              ホーム
            </Link>
            <span>/</span>
            <Link href="/posts" style={{ color: 'var(--gray400)' }} className="hover:underline">
              記事一覧
            </Link>
            <span>/</span>
            <Link
              href={`/posts?category=${canonicalCategorySlug}`}
              style={{ color: 'var(--gray400)' }}
              className="hover:underline"
            >
              {categoryMeta.label}
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="category-badge">
                {categoryMeta.label}
              </span>
              <time className="text-xs" style={{ color: 'var(--gray400)' }}>
                {new Date(post.date).toLocaleDateString("ja-JP")}
              </time>
            </div>
            <h1
              className="text-2xl font-bold leading-snug mb-3"
              style={{ color: 'var(--navy)', fontFamily: 'var(--font-inter)' }}
            >
              {post.title}
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gray400)' }}>
              {post.description}
            </p>
          </header>

          {/* Author Info Bar */}
          <div
            className="flex items-center gap-3 mb-8 px-4 py-3 rounded-lg"
            style={{ background: 'var(--snow)', border: '1px solid var(--gray200)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--navy)' }}
            >
              <span className="text-xs font-semibold" style={{ color: '#fff' }}>Y</span>
            </div>
            <div>
              <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                内藤善昭（Yoshi）
              </span>
              <span className="text-xs ml-2" style={{ color: 'var(--gray400)' }}>
                WEBディレクター・フロントエンジニア
              </span>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--gray200)', marginBottom: 32 }} />

          <div className="sl-pr-box">
            この記事には広告・アフィリエイトリンクが含まれる場合があります。また、変更監視領域では関連サービスとしてQuiet Archiveを紹介することがあります。編集方針に基づき、向いているケース・向いていないケースの両方を記載します。
          </div>

          {/* Article Body */}
          <PostContent code={post.body.code} />

          <ArticleCTA
            articleSlug={post.slug}
            articleCategory={canonicalCategorySlug}
            position="article_bottom"
          />

          {relatedPillars.length > 0 && (
            <section className="mt-10 pt-6" style={{ borderTop: '1px solid var(--gray200)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
                関連ピラーページ
              </h2>
              <div className="space-y-3">
                {relatedPillars.map((pillar) => (
                  <TrackedLink
                    key={pillar.slug}
                    href={`/pillars/${pillar.slug}`}
                    className="block rounded-lg p-4 transition-colors hover:bg-[var(--snow)]"
                    style={{ border: '1px solid var(--gray200)' }}
                    eventName="pillar_page_view"
                    params={{
                      article_slug: post.slug,
                      article_category: canonicalCategorySlug,
                      cta_type: "related_article",
                      cta_label: pillar.title,
                      destination_url: `/pillars/${pillar.slug}`,
                      position: "article_related_pillars",
                    }}
                  >
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                      {pillar.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--gray400)' }}>
                      {pillar.description}
                    </p>
                  </TrackedLink>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6" style={{ borderTop: '1px solid var(--gray200)' }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    background: 'var(--snow)',
                    color: 'var(--gray400)',
                    border: '1px solid var(--gray200)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-10 pt-6" style={{ borderTop: '1px solid var(--gray200)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
                関連記事
              </h2>
              <div className="space-y-3">
                {relatedPosts.map((relatedPost) => (
                  <TrackedLink
                    key={relatedPost.slug}
                    href={relatedPost.url}
                    className="block rounded-lg p-4 transition-colors hover:bg-[var(--snow)]"
                    style={{ border: '1px solid var(--gray200)' }}
                    eventName="related_article_click"
                    params={{
                      article_slug: post.slug,
                      article_category: canonicalCategorySlug,
                      cta_type: "related_article",
                      cta_label: relatedPost.title,
                      destination_url: relatedPost.url,
                      position: "article_related",
                    }}
                  >
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                      {relatedPost.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--gray400)' }}>
                      {relatedPost.description}
                    </p>
                  </TrackedLink>
                ))}
              </div>
            </section>
          )}

          <AuthorProfile />
        </article>

        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-20 space-y-6">

            <ArticleCTA
              articleSlug={post.slug}
              articleCategory={canonicalCategorySlug}
              position="article_sidebar"
            />

            {/* Category Nav */}
            <div
              className="rounded-xl p-5"
              style={{ background: '#fff', border: '1px solid var(--gray200)' }}
            >
              <p
                className="text-xs font-semibold mb-3 tracking-wider uppercase"
                style={{ color: 'var(--gray400)' }}
              >
                カテゴリ
              </p>
              <div className="space-y-2">
                {PRIMARY_CATEGORY_SLUGS.map((categorySlug) => (
                  <Link
                    key={categorySlug}
                    href={`/posts?category=${categorySlug}`}
                    className="flex items-center justify-between text-sm hover:underline"
                    style={{ color: 'var(--navy)' }}
                  >
                    <span>{getCategoryMeta(categorySlug).shortLabel}</span>
                    <span style={{ color: 'var(--teal)' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
