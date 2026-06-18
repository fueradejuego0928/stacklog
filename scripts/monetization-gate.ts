type WpCategory = {
  id: number;
  slug: string;
};

type WpPost = {
  id: number;
  slug: string;
  categories: number[];
  title: { rendered: string };
  content: { rendered: string };
};

type Thresholds = {
  maxMissingCta: number;
  maxPlaceholderPosts: number;
  maxContentIntegrityIssues: number;
};

const WP_BASE = process.env.WP_BASE_URL || "https://stacklogs.net";

const PLACEHOLDER_PATTERNS = [
  'href="#"',
  "AFFILIATE_URL",
  "PLACEHOLDER",
  "LANCERS_AFFILIATE_URL",
  "CW_AFFILIATE_URL_PLACEHOLDER",
];

const CONTENT_INTEGRITY_PATTERNS = [
  "post_name=&#8217;crowdworks-vs-lancers-comparison",
  "post_name='crowdworks-vs-lancers-comparison",
  "フリーランスや副業を始めようとしたとき、多くの人が最初に候補として挙げるのが",
];

function numberArg(name: string, fallback: number): number {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (!match) return fallback;
  const parsed = Number(match.slice(prefix.length));
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`invalid --${name}: ${match.slice(prefix.length)}`);
  }
  return parsed;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return (await res.json()) as T;
}

async function fetchAllPosts(): Promise<WpPost[]> {
  const posts: WpPost[] = [];
  for (let page = 1; ; page += 1) {
    const batch = await fetchJson<WpPost[]>(
      `/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,title,categories,content`
    );
    posts.push(...batch);
    if (batch.length < 100) return posts;
  }
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function hasAffiliateCta(post: WpPost): boolean {
  return post.content.rendered.includes("sl-affiliate-cta");
}

function matchingPatterns(post: WpPost, patterns: string[]): string[] {
  return patterns.filter((pattern) => post.content.rendered.includes(pattern));
}

async function main() {
  const thresholds: Thresholds = {
    maxMissingCta: numberArg("max-missing-cta", 0),
    maxPlaceholderPosts: numberArg("max-placeholder-posts", 0),
    maxContentIntegrityIssues: numberArg("max-content-integrity-issues", 0),
  };

  const [categories, posts] = await Promise.all([
    fetchJson<WpCategory[]>("/wp-json/wp/v2/categories?per_page=100"),
    fetchAllPosts(),
  ]);
  const categoryById = new Map(categories.map((category) => [category.id, category.slug]));

  const missingCta = posts.filter((post) => !hasAffiliateCta(post));
  const placeholderPosts = posts
    .map((post) => ({ post, patterns: matchingPatterns(post, PLACEHOLDER_PATTERNS) }))
    .filter(({ patterns }) => patterns.length > 0);
  const contentIssues = posts
    .filter((post) => post.slug !== "crowdworks-vs-lancers-comparison")
    .map((post) => ({ post, patterns: matchingPatterns(post, CONTENT_INTEGRITY_PATTERNS) }))
    .filter(({ patterns }) => patterns.length > 0);

  const missingByCategory = new Map<string, number>();
  for (const post of missingCta) {
    for (const id of post.categories) {
      const slug = categoryById.get(id) || String(id);
      missingByCategory.set(slug, (missingByCategory.get(slug) || 0) + 1);
    }
  }

  const failures = [
    {
      label: "missing_cta",
      actual: missingCta.length,
      max: thresholds.maxMissingCta,
    },
    {
      label: "placeholder_posts",
      actual: placeholderPosts.length,
      max: thresholds.maxPlaceholderPosts,
    },
    {
      label: "content_integrity_issues",
      actual: contentIssues.length,
      max: thresholds.maxContentIntegrityIssues,
    },
  ].filter((check) => check.actual > check.max);

  console.log("# StackLog Monetization Gate");
  console.log(`site: ${WP_BASE}`);
  console.log(`posts: ${posts.length}`);
  console.log(`missing_cta: ${missingCta.length} / max ${thresholds.maxMissingCta}`);
  console.log(`placeholder_posts: ${placeholderPosts.length} / max ${thresholds.maxPlaceholderPosts}`);
  console.log(`content_integrity_issues: ${contentIssues.length} / max ${thresholds.maxContentIntegrityIssues}`);
  console.log("");

  if (missingByCategory.size) {
    console.log("## CTA未設置カテゴリ");
    for (const [slug, count] of [...missingByCategory.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`- ${slug}: ${count}`);
    }
    console.log("");
  }

  if (placeholderPosts.length) {
    console.log("## プレースホルダー残存 Top10");
    for (const { post, patterns } of placeholderPosts.slice(0, 10)) {
      console.log(`- ${post.id} / ${post.slug}: ${patterns.join(", ")}`);
    }
    console.log("");
  }

  if (contentIssues.length) {
    console.log("## 本文混入 Top10");
    for (const { post, patterns } of contentIssues.slice(0, 10)) {
      console.log(`- ${post.id} / ${post.slug}: ${patterns[0]} / ${stripHtml(post.title.rendered)}`);
    }
    console.log("");
  }

  if (failures.length) {
    console.log("result: FAIL");
    for (const failure of failures) {
      console.log(`- ${failure.label}: ${failure.actual} > ${failure.max}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("result: PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
