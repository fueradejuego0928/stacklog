import Link from "next/link";
import { notFound } from "next/navigation";
import { useMDXComponent } from "next-contentlayer2/hooks";
import ArticleCTA from "@/components/ArticleCTA";
import AuthorProfile from "@/components/AuthorProfile";
import { getCategoryMeta, getCanonicalCategorySlug } from "@/lib/categories";
import { getPostBySlug } from "@/lib/posts";

const CANONICAL_POST_SLUG = "ai-saas/dify-how-to-use-japanese";

export async function generateMetadata() {
  const post = getPostBySlug(CANONICAL_POST_SLUG);
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

export default function DifyUsageGuideAliasPage() {
  const post = getPostBySlug(CANONICAL_POST_SLUG);
  if (!post) notFound();

  const categoryMeta = getCategoryMeta(post.category);
  const canonicalCategorySlug = getCanonicalCategorySlug(post.category);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <article>
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

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="category-badge">{categoryMeta.label}</span>
            <time className="text-xs" style={{ color: 'var(--gray400)' }}>
              {new Date(post.date).toLocaleDateString("ja-JP")}
            </time>
          </div>
          <h1 className="text-2xl font-bold leading-snug mb-3" style={{ color: 'var(--navy)' }}>
            {post.title}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--gray400)' }}>
            {post.description}
          </p>
        </header>

        <div className="sl-pr-box">
          この記事には広告・アフィリエイトリンクが含まれる場合があります。また、変更監視領域では関連サービスとしてQuiet Archiveを紹介することがあります。編集方針に基づき、向いているケース・向いていないケースの両方を記載します。
        </div>

        <PostContent code={post.body.code} />

        <ArticleCTA
          articleSlug="ai-saas/dify-usage-guide"
          articleCategory={canonicalCategorySlug}
          position="article_bottom"
        />

        <AuthorProfile />
      </article>
    </div>
  );
}
