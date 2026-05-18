import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { useMDXComponent } from "next-contentlayer2/hooks";
import AuthorProfile from "@/components/AuthorProfile";

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
    title: `${post.title} | Stacklog`,
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

const categoryLabel: Record<string, string> = {
  "ai-saas": "AIツール・SaaS",
  "fukugyou": "副業",
};

function PostContent({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code);
  return (
    <div className="prose">
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
  const relatedPosts = getAllPosts()
    .filter((candidate) => candidate.category === post.category && candidate.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
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
              href={`/posts?category=${post.category}`}
              style={{ color: 'var(--gray400)' }}
              className="hover:underline"
            >
              {categoryLabel[post.category] ?? post.category}
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="category-badge">
                {categoryLabel[post.category] ?? post.category}
              </span>
              <time className="text-xs" style={{ color: 'var(--gray400)' }}>
                {new Date(post.date).toLocaleDateString("ja-JP")}
              </time>
            </div>
            <h1
              className="text-2xl font-bold leading-snug mb-3"
              style={{ color: 'var(--navy)', fontFamily: 'var(--font-sora)' }}
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

          {/* Article Body */}
          <PostContent code={post.body.code} />

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
                  <Link
                    key={relatedPost.slug}
                    href={relatedPost.url}
                    className="block rounded-lg p-4 transition-colors hover:bg-[var(--snow)]"
                    style={{ border: '1px solid var(--gray200)' }}
                  >
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>
                      {relatedPost.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--gray400)' }}>
                      {relatedPost.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <AuthorProfile />
        </article>

        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-20 space-y-6">

            {/* Quiet Archive CTA */}
            <div
              className="rounded-xl p-5"
              style={{
                background: 'var(--navy)',
                border: '1px solid var(--navy-mid)',
              }}
            >
              <p
                className="text-xs font-semibold mb-1 tracking-wider uppercase"
                style={{ color: 'var(--teal)' }}
              >
                著者のプロダクト
              </p>
              <p className="text-sm font-bold mb-2" style={{ color: '#fff' }}>
                Quiet Archive
              </p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                URLの変更を自動検知するWebサービス。競合サイト・規制ページの監視に。
              </p>
              <a
                href="https://quietarchive.net"
                target="_blank"
                rel="noopener noreferrer"
                className="sl-btn-teal w-full text-center block"
                style={{ fontSize: 12 }}
              >
                無料で試す →
              </a>
            </div>

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
                <Link
                  href="/posts?category=ai-saas"
                  className="flex items-center justify-between text-sm hover:underline"
                  style={{ color: 'var(--navy)' }}
                >
                  <span>AIツール・SaaS</span>
                  <span style={{ color: 'var(--teal)' }}>→</span>
                </Link>
                <Link
                  href="/posts?category=fukugyou"
                  className="flex items-center justify-between text-sm hover:underline"
                  style={{ color: 'var(--navy)' }}
                >
                  <span>副業</span>
                  <span style={{ color: 'var(--teal)' }}>→</span>
                </Link>
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
