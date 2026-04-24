import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { useMDXComponent } from "next-contentlayer2/hooks";
import AuthorProfile from "@/components/AuthorProfile";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Stacklog`,
    description: post.description,
  };
}

function PostContent({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code);
  return (
    <article className="prose prose-invert prose-zinc max-w-none
      prose-headings:font-semibold prose-headings:text-zinc-100
      prose-p:text-zinc-400 prose-p:leading-relaxed
      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
      prose-code:text-zinc-300 prose-code:bg-zinc-800 prose-code:px-1 prose-code:rounded
      prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
      prose-strong:text-zinc-200
      prose-li:text-zinc-400">
      <MDXContent />
    </article>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
            {post.category}
          </span>
          <time className="text-xs text-zinc-500">
            {new Date(post.date).toLocaleDateString("ja-JP")}
          </time>
        </div>
        <h1 className="text-2xl font-semibold text-zinc-100 leading-snug mb-3">
          {post.title}
        </h1>
        <p className="text-sm text-zinc-500">{post.description}</p>
      </div>
      <hr className="border-zinc-800 mb-8" />
      <PostContent code={post.body.code} />
      <AuthorProfile />
    </main>
  );
}
