type WpCategory = {
  id: number;
  slug: string;
  name: string;
};

type WpPostListItem = {
  id: number;
  slug: string;
  link: string;
  categories: number[];
  title: { rendered: string };
  content: { rendered: string };
};

type WpPostEdit = {
  id: number;
  slug: string;
  link: string;
  content: { raw?: string; rendered?: string };
};

type CtaPlan = {
  key: string;
  title: string;
  html: string;
};

function loadEnvLocal(): void {
  const fs = require("node:fs") as typeof import("node:fs");
  const path = require("node:path") as typeof import("node:path");
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([A-Z_a-z][A-Z_a-z0-9]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "").trim();
    }
  }
}

loadEnvLocal();

const WP_BASE = process.env.WP_BASE_URL || "https://stacklogs.net";
const APPLY = process.argv.includes("--apply");
const DRY = !APPLY;

const LINE_WORKS_URL =
  "//af.moshimo.com/af/c/click?a_id=5537117&p_id=7446&pc_id=21479&pl_id=93515";
const LINE_WORKS_PIXEL =
  '<img src="//i.moshimo.com/af/i/impression?a_id=5537117&p_id=7446&pc_id=21479&pl_id=93515" width="1" height="1" style="border:none;" loading="lazy">';
const ILSIL_URL =
  "//af.moshimo.com/af/c/click?a_id=5537121&p_id=7044&pc_id=20165&pl_id=89063";
const ILSIL_PIXEL =
  '<img src="//i.moshimo.com/af/i/impression?a_id=5537121&p_id=7044&pc_id=20165&pl_id=89063" width="1" height="1" style="border:none;" loading="lazy">';
const REMOBA_URL =
  "//af.moshimo.com/af/c/click?a_id=5520918&p_id=3772&pc_id=9267&pl_id=52513";
const REMOBA_PIXEL =
  '<img src="//i.moshimo.com/af/i/impression?a_id=5520918&p_id=3772&pc_id=9267&pl_id=52513" width="1" height="1" style="border:none;" loading="lazy">';
const CW_TECH_URL = "https://px.a8.net/svt/ejp?a8mat=4B3IIN+4J4SJ6+2OM2+100IDU";
const CW_TECH_PIXEL =
  '<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=4B3IIN+4J4SJ6+2OM2+100IDU" alt="">';
const FJORD_URL =
  "//af.moshimo.com/af/c/click?a_id=5537112&p_id=7462&pc_id=21548&pl_id=93643";
const FJORD_PIXEL =
  '<img src="//i.moshimo.com/af/i/impression?a_id=5537112&p_id=7462&pc_id=21548&pl_id=93643" width="1" height="1" style="border:none;" loading="lazy">';

const PLANS: Record<string, CtaPlan> = {
  lineworks: {
    key: "lineworks",
    title: "LINE WORKS AiNote",
    html: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">AIを仕事に活かすなら｜LINE WORKS AiNote</div>
  <p class="sl-affiliate-cta-desc">AIが会議音声をリアルタイムで文字起こし・要約。まずは資料をダウンロードして、業務効率化に使えるか確認してください。</p>
  <a href="${LINE_WORKS_URL}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" class="sl-btn-teal">無料で資料をダウンロード →</a>
  ${LINE_WORKS_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  },
  ilsil: {
    key: "ilsil",
    title: "イルシル",
    html: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">AIでスライドを自動作成｜イルシル 法人プラン</div>
  <p class="sl-affiliate-cta-desc">テキストを入力するだけでプレゼン資料が完成。法人向けプランの詳細・料金はお問い合わせで確認できます。</p>
  <a href="${ILSIL_URL}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" class="sl-btn-teal">法人プランを無料で問い合わせる →</a>
  ${ILSIL_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  },
  remoba: {
    key: "remoba",
    title: "Remoba労務",
    html: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">労務管理をアウトソーシングで解決</div>
  <p class="sl-affiliate-cta-desc">Remoba労務なら、勤怠管理・社会保険・給与計算などの労務業務をオンラインで丸ごとアウトソーシングできます。</p>
  <a href="${REMOBA_URL}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" class="sl-btn-teal">Remoba労務に無料で問い合わせる →</a>
  ${REMOBA_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  },
  cwtech: {
    key: "cwtech",
    title: "クラウドワークス テック",
    html: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">クラウドワークス テックに登録して案件を探す</div>
  <p class="sl-affiliate-cta-desc">ITエンジニア・デザイナー向け案件に特化したフリーランスプラットフォーム。まずは無料で登録して案件を確認できます。</p>
  <a href="${CW_TECH_URL}" rel="nofollow" class="sl-btn-teal">無料で登録する →</a>
  ${CW_TECH_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  },
  fjord: {
    key: "fjord",
    title: "FJORD BOOT CAMP",
    html: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">FJORD BOOT CAMP｜現役エンジニアに学ぶ実践型スクール</div>
  <p class="sl-affiliate-cta-desc">未経験からWebエンジニアへ。メンター制・実践カリキュラムで着実にスキルを身につけられます。</p>
  <a href="${FJORD_URL}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" class="sl-btn-teal">無料カウンセリングを申し込む →</a>
  ${FJORD_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  },
  quietarchive: {
    key: "quietarchive",
    title: "Quiet Archive",
    html: `<div class="sl-affiliate-cta sl-affiliate-cta--workflow">
  <div class="sl-affiliate-cta-title">PDF・規約・取引先文書の変更を自動監視する</div>
  <p class="sl-affiliate-cta-desc">Quiet Archiveなら、PDFや規約ページの変更検知からAI要約、確認フローまで業務に接続できます。</p>
  <a href="https://www.quietarchive.net/?utm_source=stacklog&utm_medium=article_cta&utm_campaign=workflow_seo" class="sl-btn-teal" target="_blank" rel="noopener">監視ワークフローを確認する →</a>
  <p class="sl-affiliate-note">※StackLog関連サービスへの案内です</p>
</div>`,
  },
};

const SPECIFIC_PLAN_BY_SLUG: Record<string, string> = {
  "ai-image-generation-tools-recommended": "ilsil",
  "ai-writing-tools-comparison": "ilsil",
  "text-generation-ai-comparison": "ilsil",
  "free-ai-tools-work-efficiency": "lineworks",
  "ai-tools-recommended-side-job": "lineworks",
  "chatgpt-pricing-personal-plan-guide": "lineworks",
  "dify-how-to-use-japanese": "lineworks",
  "notion-ai-how-to-use": "lineworks",
  "pdf-monitoring-automation": "quietarchive",
  "hubspot-crm-howto-guide-2": "lineworks",
  "smarthr-howto-guide": "remoba",
  "crowdworks-beginner-jobs-to-earn-money": "cwtech",
  "crowdworks-vs-lancers-comparison": "cwtech",
  "programming-school-recommendations-for-working-adults": "fjord",
  "freelance-how-to-start-non-engineer": "fjord",
  "freelance-web-director-income": "cwtech",
  "side-job-tax-return-how-much-company-employee": "cwtech",
  "side-job-recommended-company-employee": "cwtech",
  "side-job-not-found-out-company-employee": "cwtech",
  "saas-side-job-recommended": "cwtech",
};

const WORKFLOW_CATEGORIES = new Set([
  "monitoring",
  "pdf-monitoring",
  "vendor-procurement",
  "compliance-audit",
]);

function authHeader(): Record<string, string> {
  const user = process.env.WP_USER;
  const password = process.env.WP_APP_PASSWORD;
  if (!user || !password) return {};
  const token = Buffer.from(`${user}:${password}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${WP_BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${path}\n${text}`);
  }
  return (await res.json()) as T;
}

async function fetchAllPosts(): Promise<WpPostListItem[]> {
  const posts: WpPostListItem[] = [];
  for (let page = 1; ; page += 1) {
    const batch = await fetchJson<WpPostListItem[]>(
      `/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,title,categories,content,link`
    );
    posts.push(...batch);
    if (batch.length < 100) return posts;
  }
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function choosePlan(post: WpPostListItem, categorySlugs: string[]): CtaPlan | null {
  const specific = SPECIFIC_PLAN_BY_SLUG[post.slug];
  if (specific) return PLANS[specific];
  if (categorySlugs.some((slug) => WORKFLOW_CATEGORIES.has(slug))) {
    return PLANS.quietarchive;
  }
  return null;
}

function insertBeforeSummary(content: string, ctaHtml: string): string {
  const summaryH2 = /<h2[^>]*>\s*まとめ[\s\S]*?<\/h2>/i;
  if (summaryH2.test(content)) {
    return content.replace(summaryH2, `${ctaHtml}\n\n$&`);
  }
  return `${content.trim()}\n\n${ctaHtml}`;
}

async function getEditablePost(postId: number): Promise<WpPostEdit> {
  return fetchJson<WpPostEdit>(`/wp-json/wp/v2/posts/${postId}?context=edit`, {
    headers: authHeader(),
  });
}

async function updatePost(postId: number, content: string) {
  return fetchJson<WpPostEdit>(`/wp-json/wp/v2/posts/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ content }),
  });
}

async function main() {
  if (APPLY && (!process.env.WP_USER || !process.env.WP_APP_PASSWORD)) {
    throw new Error("--apply requires WP_USER and WP_APP_PASSWORD");
  }

  const categories = await fetchJson<WpCategory[]>("/wp-json/wp/v2/categories?per_page=100");
  const categoryById = new Map(categories.map((cat) => [cat.id, cat]));
  const posts = await fetchAllPosts();

  const candidates = posts
    .map((post) => {
      const html = post.content.rendered || "";
      const categorySlugs = post.categories
        .map((id) => categoryById.get(id)?.slug || String(id));
      const plan = choosePlan(post, categorySlugs);
      return { post, html, categorySlugs, plan };
    })
    .filter(({ html, plan }) => plan && !html.includes("sl-affiliate-cta"));

  const placeholderPosts = posts.filter((post) =>
    /AFFILIATE_URL|PLACEHOLDER|href="#"/.test(post.content.rendered || "")
  );

  console.log(`# monetization-fix ${DRY ? "dry-run" : "apply"}`);
  console.log(`site: ${WP_BASE}`);
  console.log(`planned_cta_updates: ${candidates.length}`);
  console.log(`placeholder_posts: ${placeholderPosts.length}`);
  console.log("");

  for (const { post, categorySlugs, plan } of candidates) {
    if (!plan) continue;
    console.log(`- ${post.id} / ${post.slug} / ${categorySlugs.join(",")} / ${plan.title}`);
    if (APPLY) {
      const editable = await getEditablePost(post.id);
      const raw = editable.content.raw || editable.content.rendered || "";
      if (raw.includes("sl-affiliate-cta")) {
        console.log("  skipped: already has CTA in editable content");
        continue;
      }
      const nextContent = insertBeforeSummary(raw, plan.html);
      await updatePost(post.id, nextContent);
      console.log(`  updated: ${post.link}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (placeholderPosts.length) {
    console.log("");
    console.log("## manual review required: placeholders remain");
    for (const post of placeholderPosts) {
      console.log(`- ${post.id} / ${post.slug} / ${stripHtml(post.title.rendered)}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
