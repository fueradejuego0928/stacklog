import Link from "next/link";
import { getAllPosts, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { getCategoryMeta, PRIMARY_CATEGORY_SLUGS, SECONDARY_CATEGORY_SLUGS } from "@/lib/categories";

export const metadata = {
  title: "Workflow記事一覧",
  description:
    "SaaS比較、Back Office、AI Automation、Monitoring & Evidence、Quiet Archive Labに関する記事一覧。",
};

const CATEGORIES = [
  { value: "", label: "すべて" },
  ...PRIMARY_CATEGORY_SLUGS.map((value) => ({
    value,
    label: getCategoryMeta(value).shortLabel,
  })),
  ...SECONDARY_CATEGORY_SLUGS.map((value) => ({
    value,
    label: getCategoryMeta(value).shortLabel,
  })),
];

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();
  const workflowPosts = allPosts.filter((post) => getCategoryMeta(post.category).priority !== "legacy");
  const posts = category ? getPostsByCategory(category) : workflowPosts;
  const totalCount = workflowPosts.length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
          Workflow記事一覧
        </h1>
        <p className="text-sm" style={{ color: 'var(--gray400)' }}>
          SaaS比較、Back Office、AI Automation、Monitoring & Evidence、Quiet Archive Labの記事（全{totalCount}記事）
        </p>
      </div>

      {/* Category Tabs */}
      <div
        className="category-tabs"
        style={{ borderBottom: '1px solid var(--gray200)' }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = (category ?? "") === cat.value;
          const href = cat.value ? `/posts?category=${cat.value}` : "/posts";
          return (
            <Link
              key={cat.value}
              href={href}
              className="category-tab"
              style={{
                background: isActive ? 'var(--navy)' : 'transparent',
                color: isActive ? '#fff' : 'var(--gray400)',
                border: isActive ? '1px solid var(--navy)' : '1px solid var(--gray200)',
              }}
            >
              {cat.label}
            </Link>
          );
        })}
        <span className="ml-auto text-xs" style={{ color: 'var(--gray400)' }}>
          {posts.length}件
        </span>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--gray400)' }}>
          該当する記事はありません。
        </p>
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
