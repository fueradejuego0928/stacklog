import Link from "next/link";
import { Post } from "contentlayer/generated";
import { getCategoryMeta } from "@/lib/categories";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={post.url} className="group block">
      <article className="post-card">
        <div className="flex items-center gap-2 mb-3">
          <span className="category-badge">
            {getCategoryMeta(post.category).shortLabel}
          </span>
          <time className="text-xs" style={{ color: 'var(--gray400)' }}>
            {new Date(post.date).toLocaleDateString("ja-JP")}
          </time>
        </div>
        <h2
          className="text-sm font-semibold leading-snug mb-2 transition-colors"
          style={{ color: 'var(--navy)' }}
        >
          {post.title}
        </h2>
        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--gray400)' }}>
          {post.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs"
              style={{ color: 'var(--gray400)', fontFamily: 'var(--font-jetbrains)' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
