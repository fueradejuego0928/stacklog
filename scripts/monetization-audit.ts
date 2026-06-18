type WpCategory = {
  id: number;
  slug: string;
  name: string;
  count: number;
};

type WpPost = {
  id: number;
  slug: string;
  link: string;
  date: string;
  categories: number[];
  title: { rendered: string };
  content: { rendered: string };
};

const WP_BASE = process.env.WP_BASE_URL || "https://stacklogs.net";
const PLACEHOLDER_PATTERNS = [
  "href=\"#\"",
  "AFFILIATE_URL",
  "PLACEHOLDER",
  "LANCERS_AFFILIATE_URL",
  "CW_AFFILIATE_URL_PLACEHOLDER",
];

const CONTAMINATION_PATTERNS = [
  "post_name=&#8217;crowdworks-vs-lancers-comparison",
  "post_name='crowdworks-vs-lancers-comparison",
  "フリーランスや副業を始めようとしたとき、多くの人が最初に候補として挙げるのが",
];

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${path}`);
  }
  return (await res.json()) as T;
}

async function fetchAllPosts(): Promise<WpPost[]> {
  const posts: WpPost[] = [];
  for (let page = 1; ; page += 1) {
    const batch = await fetchJson<WpPost[]>(
      `/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,title,categories,content,link,date`
    );
    posts.push(...batch);
    if (batch.length < 100) return posts;
  }
}

function hasAffiliateCta(post: WpPost): boolean {
  return post.content.rendered.includes("sl-affiliate-cta");
}

function placeholders(post: WpPost): string[] {
  return PLACEHOLDER_PATTERNS.filter((pattern) =>
    post.content.rendered.includes(pattern)
  );
}

function contamination(post: WpPost): string[] {
  if (post.slug === "crowdworks-vs-lancers-comparison") return [];
  return CONTAMINATION_PATTERNS.filter((pattern) =>
    post.content.rendered.includes(pattern)
  );
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function main() {
  const categories = await fetchJson<WpCategory[]>(
    "/wp-json/wp/v2/categories?per_page=100"
  );
  const categoryById = new Map(categories.map((cat) => [cat.id, cat]));
  const posts = await fetchAllPosts();

  const missingCta = posts.filter((post) => !hasAffiliateCta(post));
  const withPlaceholders = posts
    .map((post) => ({ post, patterns: placeholders(post) }))
    .filter((item) => item.patterns.length > 0);
  const contaminated = posts
    .map((post) => ({ post, patterns: contamination(post) }))
    .filter((item) => item.patterns.length > 0);

  const missingByCategory = new Map<string, number>();
  for (const post of missingCta) {
    for (const categoryId of post.categories) {
      const slug = categoryById.get(categoryId)?.slug || String(categoryId);
      missingByCategory.set(slug, (missingByCategory.get(slug) || 0) + 1);
    }
  }

  console.log(`# StackLog Monetization Audit`);
  console.log(`site: ${WP_BASE}`);
  console.log(`posts: ${posts.length}`);
  console.log(`missing_cta: ${missingCta.length}`);
  console.log(`placeholder_posts: ${withPlaceholders.length}`);
  console.log(`content_integrity_issues: ${contaminated.length}`);
  console.log("");

  console.log("## CTA未設置カテゴリ");
  for (const [slug, count] of [...missingByCategory.entries()].sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`- ${slug}: ${count}`);
  }
  console.log("");

  console.log("## CTA未設置記事");
  for (const post of missingCta) {
    const cats = post.categories
      .map((id) => categoryById.get(id)?.slug || String(id))
      .join(",");
    console.log(`- ${post.id} / ${post.slug} / ${cats} / ${stripHtml(post.title.rendered)}`);
  }
  console.log("");

  console.log("## プレースホルダー残存");
  if (withPlaceholders.length === 0) {
    console.log("- なし");
  } else {
    for (const { post, patterns } of withPlaceholders) {
      console.log(`- ${post.id} / ${post.slug}: ${patterns.join(", ")}`);
    }
  }
  console.log("");

  console.log("## 本文混入・復旧が必要");
  if (contaminated.length === 0) {
    console.log("- なし");
  } else {
    for (const { post, patterns } of contaminated) {
      console.log(`- ${post.id} / ${post.slug}: ${patterns[0]}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
