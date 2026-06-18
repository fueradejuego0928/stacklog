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

type Program = {
  name: string;
  expectedReward: number;
  confidence: "high" | "medium" | "low";
};

const WP_BASE = process.env.WP_BASE_URL || "https://stacklogs.net";

const CATEGORY_PROGRAMS: Record<string, Program> = {
  "ai-tools": { name: "LINE WORKS AiNote / イルシル", expectedReward: 6000, confidence: "high" },
  "ai-workflow": { name: "LINE WORKS AiNote / イルシル", expectedReward: 6000, confidence: "high" },
  "workflow-automation": { name: "LINE WORKS AiNote", expectedReward: 6000, confidence: "high" },
  "monitoring": { name: "Quiet Archive", expectedReward: 0, confidence: "medium" },
  "pdf-monitoring": { name: "Quiet Archive", expectedReward: 0, confidence: "medium" },
  "vendor-procurement": { name: "Quiet Archive", expectedReward: 0, confidence: "medium" },
  "compliance-audit": { name: "Quiet Archive", expectedReward: 0, confidence: "medium" },
  "fukugyou": { name: "FJORD / クラウドワークス テック", expectedReward: 3500, confidence: "high" },
  "hr": { name: "Remoba労務 / freee人事労務", expectedReward: 5000, confidence: "medium" },
  "accounting": { name: "freee / マネーフォワード", expectedReward: 7000, confidence: "high" },
  "crm-ma": { name: "HubSpot再申請待ち / LINE WORKS暫定", expectedReward: 3000, confidence: "low" },
  "contract": { name: "Great Sign / クラウドサイン", expectedReward: 5000, confidence: "low" },
};

const HIGH_SEVERITY_PATTERNS = [
  "href=\"#\"",
  "AFFILIATE_URL",
  "PLACEHOLDER",
  "LANCERS_AFFILIATE_URL",
  "CW_AFFILIATE_URL_PLACEHOLDER",
  "post_name=&#8217;crowdworks-vs-lancers-comparison",
  "post_name='crowdworks-vs-lancers-comparison",
];

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
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

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function hasCta(post: WpPost): boolean {
  return post.content.rendered.includes("sl-affiliate-cta");
}

function issuePatterns(post: WpPost): string[] {
  return HIGH_SEVERITY_PATTERNS.filter((pattern) =>
    post.content.rendered.includes(pattern)
  );
}

function primaryCategory(post: WpPost, categoryById: Map<number, WpCategory>): string {
  return categoryById.get(post.categories[0])?.slug || String(post.categories[0] || "unknown");
}

function postValue(post: WpPost, categoryById: Map<number, WpCategory>): number {
  const categorySlugs = post.categories.map((id) => categoryById.get(id)?.slug || "");
  const rewards = categorySlugs
    .map((slug) => CATEGORY_PROGRAMS[slug]?.expectedReward || 0)
    .filter((reward) => reward > 0);
  return rewards.length ? Math.max(...rewards) : 0;
}

function formatYen(value: number): string {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

async function main() {
  const categories = await fetchJson<WpCategory[]>("/wp-json/wp/v2/categories?per_page=100");
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const posts = await fetchAllPosts();

  const missingCta = posts.filter((post) => !hasCta(post));
  const critical = posts
    .map((post) => ({ post, patterns: issuePatterns(post) }))
    .filter(({ patterns }) => patterns.length > 0);

  const totalPotentialFixValue = missingCta.reduce(
    (sum, post) => sum + postValue(post, categoryById),
    0
  );
  const totalPostValue = posts.reduce((sum, post) => sum + postValue(post, categoryById), 0);

  const estimatedMonthlyIf1000Clicks = totalPostValue * 0.02 * 1000 / Math.max(posts.length, 1);
  const ctaCoverage = posts.length ? (posts.length - missingCta.length) / posts.length : 0;

  const priority = [
    ...critical.map(({ post, patterns }) => ({
      post,
      reason: `CRITICAL: ${patterns[0]}`,
      value: postValue(post, categoryById) + 10000,
    })),
    ...missingCta.map((post) => ({
      post,
      reason: "CTA未設置",
      value: postValue(post, categoryById),
    })),
  ]
    .sort((a, b) => b.value - a.value || a.post.id - b.post.id)
    .slice(0, 15);

  console.log("# StackLog Weekly Monetization Report");
  console.log(`site: ${WP_BASE}`);
  console.log(`posts: ${posts.length}`);
  console.log(`cta_coverage: ${(ctaCoverage * 100).toFixed(1)}%`);
  console.log(`missing_cta: ${missingCta.length}`);
  console.log(`critical_content_or_placeholder: ${critical.length}`);
  console.log(`unrealized_cta_reward_pool: ${formatYen(totalPotentialFixValue)}`);
  console.log("");

  console.log("## 目標ギャップ");
  console.log("- 月30万円に必要なCV目安: 報酬5,000円なら60件、報酬8,000円なら38件");
  console.log("- 月50万円に必要なCV目安: 報酬5,000円なら100件、報酬8,000円なら63件");
  console.log(`- 参考: 現102本の平均案件単価ベースで、1,000クリック・CVR2%なら約${formatYen(estimatedMonthlyIf1000Clicks)}/月`);
  console.log("- したがって短期の焦点は、検索流入前に全記事のCV導線を塞がないこと");
  console.log("");

  console.log("## 今週の優先アクション Top15");
  for (const item of priority) {
    const cat = primaryCategory(item.post, categoryById);
    const program = CATEGORY_PROGRAMS[cat]?.name || "要設計";
    console.log(
      `- ${item.post.id} / ${item.post.slug} / ${cat} / ${program} / ${item.reason} / ${stripHtml(item.post.title.rendered)}`
    );
  }
  console.log("");

  console.log("## カテゴリ別CTA未設置");
  const counts = new Map<string, number>();
  for (const post of missingCta) {
    for (const id of post.categories) {
      const slug = categoryById.get(id)?.slug || String(id);
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
  }
  for (const [slug, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    const program = CATEGORY_PROGRAMS[slug]?.name || "要設計";
    console.log(`- ${slug}: ${count} / ${program}`);
  }
  console.log("");

  console.log("## 次の実行");
  console.log("1. /Users/zen/stacklog/scripts/_monetization_production.php をWordPressルートへアップロード");
  console.log("2. https://stacklogs.net/_monetization_production.php?mode=dry");
  console.log("3. https://stacklogs.net/_monetization_production.php?delete=1");
  console.log("4. npm run audit:monetization");
  console.log("5. content_integrity_issues: 0 / placeholder_posts: 0 / missing_cta大幅減 を確認");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
