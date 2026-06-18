#!/usr/bin/env tsx

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const OUT = path.join(process.cwd(), "scripts/_monetization_production.php");

const RESTORE_SLUGS = [
  "side-job-tax-return-how-much-company-employee",
  "side-job-recommended-company-employee",
  "side-job-not-found-out-company-employee",
  "saas-side-job-recommended",
  "programming-school-recommendations-for-working-adults",
  "freelance-web-director-income",
  "freelance-how-to-start-non-engineer",
  "crowdworks-vs-lancers-comparison",
];

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

const CTA_HTML: Record<string, string> = {
  lineworks: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">AIを仕事に活かすなら｜LINE WORKS AiNote</div>
  <p class="sl-affiliate-cta-desc">AIが会議音声をリアルタイムで文字起こし・要約。まずは資料をダウンロードして、業務効率化に使えるか確認してください。</p>
  <a href="${LINE_WORKS_URL}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" class="sl-btn-teal">無料で資料をダウンロード →</a>
  ${LINE_WORKS_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  ilsil: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">AIでスライドを自動作成｜イルシル 法人プラン</div>
  <p class="sl-affiliate-cta-desc">テキストを入力するだけでプレゼン資料が完成。法人向けプランの詳細・料金はお問い合わせで確認できます。</p>
  <a href="${ILSIL_URL}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" class="sl-btn-teal">法人プランを無料で問い合わせる →</a>
  ${ILSIL_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  remoba: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">労務管理をアウトソーシングで解決</div>
  <p class="sl-affiliate-cta-desc">Remoba労務なら、勤怠管理・社会保険・給与計算などの労務業務をオンラインで丸ごとアウトソーシングできます。</p>
  <a href="${REMOBA_URL}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" class="sl-btn-teal">Remoba労務に無料で問い合わせる →</a>
  ${REMOBA_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  cwtech: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">クラウドワークス テックに登録して案件を探す</div>
  <p class="sl-affiliate-cta-desc">ITエンジニア・デザイナー向け案件に特化したフリーランスプラットフォーム。まずは無料で登録して案件を確認できます。</p>
  <a href="${CW_TECH_URL}" rel="nofollow" class="sl-btn-teal">無料で登録する →</a>
  ${CW_TECH_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  fjord: `<div class="sl-affiliate-cta">
  <div class="sl-affiliate-cta-title">FJORD BOOT CAMP｜現役エンジニアに学ぶ実践型スクール</div>
  <p class="sl-affiliate-cta-desc">未経験からWebエンジニアへ。メンター制・実践カリキュラムで着実にスキルを身につけられます。</p>
  <a href="${FJORD_URL}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" class="sl-btn-teal">無料カウンセリングを申し込む →</a>
  ${FJORD_PIXEL}
  <p class="sl-affiliate-note">※本リンクはアフィリエイト広告です</p>
</div>`,
  quietarchive: `<div class="sl-affiliate-cta sl-affiliate-cta--workflow">
  <div class="sl-affiliate-cta-title">PDF・規約・取引先文書の変更を自動監視する</div>
  <p class="sl-affiliate-cta-desc">Quiet Archiveなら、PDFや規約ページの変更検知からAI要約、確認フローまで業務に接続できます。</p>
  <a href="https://www.quietarchive.net/?utm_source=stacklog&utm_medium=article_cta&utm_campaign=workflow_seo" class="sl-btn-teal" target="_blank" rel="noopener">監視ワークフローを確認する →</a>
  <p class="sl-affiliate-note">※StackLog関連サービスへの案内です</p>
</div>`,
};

const CTA_BY_SLUG: Record<string, keyof typeof CTA_HTML> = {
  "pdf-document-monitoring": "quietarchive",
  "contract-renewal-management": "quietarchive",
  "regulation-change-monitoring": "quietarchive",
  "procurement-approval-workflow": "quietarchive",
  "vendor-requirement-change-workflow": "quietarchive",
  "compliance-document-monitoring": "quietarchive",
  "internal-audit-trail-risks": "quietarchive",
  "web-tampering-detection-tools": "quietarchive",
  "contract-update-management-system": "quietarchive",
  "price-change-monitoring-tools": "quietarchive",
  "terms-of-service-monitoring-automation": "quietarchive",
  "url-monitoring-automation": "quietarchive",
  "web-monitoring-tools-comparison": "quietarchive",
  "pdf-monitoring-automation": "quietarchive",
  "smarthr-howto-guide": "remoba",
  "hubspot-crm-howto-guide-2": "lineworks",
  "text-generation-ai-comparison": "ilsil",
  "notion-ai-how-to-use": "lineworks",
  "free-ai-tools-work-efficiency": "lineworks",
  "dify-how-to-use-japanese": "lineworks",
  "chatgpt-pricing-personal-plan-guide": "lineworks",
  "ai-writing-tools-comparison": "ilsil",
  "ai-tools-recommended-side-job": "lineworks",
  "ai-image-generation-tools-recommended": "ilsil",
  "side-job-tax-return-how-much-company-employee": "cwtech",
  "side-job-recommended-company-employee": "cwtech",
  "side-job-not-found-out-company-employee": "cwtech",
  "saas-side-job-recommended": "cwtech",
  "programming-school-recommendations-for-working-adults": "fjord",
  "freelance-web-director-income": "cwtech",
  "freelance-how-to-start-non-engineer": "fjord",
};

function findMdxBySlug(slug: string): string {
  const root = path.join(process.cwd(), "content/posts");
  for (const category of fs.readdirSync(root)) {
    const file = path.join(root, category, `${slug}.mdx`);
    if (fs.existsSync(file)) return file;
  }
  throw new Error(`missing MDX for ${slug}`);
}

async function mdxToHtml(raw: string): Promise<string> {
  const preprocessed = raw
    .replace(/^import\s+[^\n]+$/gm, "")
    .replace(/^export\s+default\s+[^\n]+$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/className=/g, "class=")
    .replace(/style=\{\{([^}]+)\}\}/g, (_: string, inner: string) => {
      const css = inner
        .split(",")
        .map((prop: string) => {
          const [keyPart, ...valueParts] = prop.split(":");
          const key = keyPart.trim().replace(/['"]/g, "");
          const value = valueParts.join(":").trim().replace(/['"]/g, "");
          const kebab = key.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`);
          return `${kebab}: ${value}`;
        })
        .filter(Boolean)
        .join("; ");
      return `style="${css}"`;
    })
    .replace(/<img([^>]*)\s*\/>/g, "<img$1>")
    .trim();

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(preprocessed);

  return String(result)
    .replace(
      /<blockquote[^>]*>[\s\S]*?(?:※PR表記|アフィリエイト広告|本記事には)[\s\S]*?<\/blockquote>\s*/gi,
      ""
    )
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function phpString(value: string): string {
  return `<<<'HTML'\n${value}\nHTML`;
}

async function main() {
  const restore: Record<string, string> = {};
  for (const slug of RESTORE_SLUGS) {
    const file = findMdxBySlug(slug);
    const parsed = matter(fs.readFileSync(file, "utf-8"));
    restore[slug] = await mdxToHtml(parsed.content);
  }

  const restoreEntries = Object.entries(restore)
    .map(([slug, html]) => `  '${slug}' => ${phpString(html)},`)
    .join("\n");
  const ctaEntries = Object.entries(CTA_BY_SLUG)
    .map(([slug, key]) => `  '${slug}' => ${phpString(CTA_HTML[key])},`)
    .join("\n");

  const php = `<?php
// StackLog monetization production fixer.
// Upload to WordPress root, run ?mode=dry first, then run without mode, then delete.

$allowed_ips = [
  '133.201.143.224',
  '2404:7a81:8fe0:8500:bcfc:8ff8:5057:4a86',
  '2404:7a81:8fe0:8500:9540:c66d:de05:5996',
];
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (PHP_SAPI !== 'cli' && !in_array($remote, $allowed_ips, true)) {
  http_response_code(403);
  die('Forbidden');
}

$dry_run = (PHP_SAPI === 'cli')
  ? in_array('--dry', array_slice($argv ?? [], 1), true)
  : (isset($_GET['mode']) && $_GET['mode'] === 'dry');
$self_delete = (PHP_SAPI === 'cli')
  ? in_array('--delete-self', array_slice($argv ?? [], 1), true)
  : (isset($_GET['delete']) && $_GET['delete'] === '1');
$fix_auth = (PHP_SAPI === 'cli')
  ? in_array('--fix-auth', array_slice($argv ?? [], 1), true)
  : (isset($_GET['fix_auth']) && $_GET['fix_auth'] === '1');

define('WP_USE_THEMES', false);
require_once __DIR__ . '/wp-load.php';

$restore_contents = [
${restoreEntries}
];

$cta_by_slug = [
${ctaEntries}
];

function sl_find_post_id_by_slug($slug) {
  $posts = get_posts([
    'name' => $slug,
    'post_type' => 'post',
    'post_status' => 'any',
    'posts_per_page' => 1,
    'fields' => 'ids',
  ]);
  return empty($posts) ? 0 : (int) $posts[0];
}

function sl_insert_cta_before_summary($content, $cta) {
  if (strpos($content, 'sl-affiliate-cta') !== false) {
    return $content;
  }
  if (preg_match('/<h2[^>]*>\\s*まとめ[\\s\\S]*?<\\/h2>/u', $content)) {
    return preg_replace_callback(
      '/<h2[^>]*>\\s*まとめ[\\s\\S]*?<\\/h2>/u',
      function ($matches) use ($cta) {
        return $cta . "\\n\\n" . $matches[0];
      },
      $content,
      1
    );
  }
  return rtrim($content) . "\\n\\n" . $cta;
}

function sl_ensure_authorization_rewrite() {
  $path = __DIR__ . '/.htaccess';
  $rule = 'RewriteRule ^ - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]';

  if (!file_exists($path) || !is_readable($path) || !is_writable($path)) {
    return 'htaccess_not_writable';
  }

  $content = file_get_contents($path);
  if (strpos($content, $rule) !== false) {
    return 'htaccess_rule_exists';
  }

  if (strpos($content, 'RewriteEngine On') === false) {
    return 'rewrite_engine_not_found';
  }

  $next = preg_replace('/RewriteEngine On\\s*/', "RewriteEngine On\\n{$rule}\\n", $content, 1);
  if ($next === null || $next === $content) {
    return 'htaccess_patch_failed';
  }

  $backup = $path . '.stacklog-backup-' . date('YmdHis');
  @copy($path, $backup);
  file_put_contents($path, $next);
  return 'htaccess_rule_added';
}

$updated = 0;
$skipped = 0;
$failed = 0;

echo "StackLog monetization fixer " . ($dry_run ? "[DRY RUN]" : "[APPLY]") . "\\n";
echo str_repeat('-', 72) . "\\n";

if ($fix_auth) {
  echo "AUTH " . sl_ensure_authorization_rewrite() . "\\n";
}

foreach ($restore_contents as $slug => $html) {
  $post_id = sl_find_post_id_by_slug($slug);
  if (!$post_id) {
    echo "RESTORE missing: {$slug}\\n";
    $failed++;
    continue;
  }
  echo "RESTORE {$post_id} {$slug}\\n";
  if (!$dry_run) {
    $result = wp_update_post([
      'ID' => $post_id,
      'post_content' => $html,
    ], true);
    if (is_wp_error($result)) {
      echo "  ERROR: " . $result->get_error_message() . "\\n";
      $failed++;
      continue;
    }
  }
  $updated++;
}

foreach ($cta_by_slug as $slug => $cta) {
  $post_id = sl_find_post_id_by_slug($slug);
  if (!$post_id) {
    echo "CTA missing: {$slug}\\n";
    $failed++;
    continue;
  }
  $post = get_post($post_id);
  if (!$post) {
    echo "CTA no post object: {$slug}\\n";
    $failed++;
    continue;
  }
  if (strpos($post->post_content, 'sl-affiliate-cta') !== false) {
    echo "CTA skip existing {$post_id} {$slug}\\n";
    $skipped++;
    continue;
  }
  echo "CTA add {$post_id} {$slug}\\n";
  if (!$dry_run) {
    $next = sl_insert_cta_before_summary($post->post_content, $cta);
    $result = wp_update_post([
      'ID' => $post_id,
      'post_content' => $next,
    ], true);
    if (is_wp_error($result)) {
      echo "  ERROR: " . $result->get_error_message() . "\\n";
      $failed++;
      continue;
    }
  }
  $updated++;
}

echo str_repeat('=', 72) . "\\n";
echo "updated_or_planned: {$updated} skipped: {$skipped} failed: {$failed}\\n";
if (!$dry_run && $self_delete) {
  @unlink(__FILE__);
  echo "self_deleted: yes\\n";
} else {
  echo "After apply, delete this file immediately. Add &delete=1 to delete automatically after apply.\\n";
}
`;

  fs.writeFileSync(OUT, php);
  console.log(`generated: ${OUT}`);
  console.log(`restore: ${Object.keys(restore).length}`);
  console.log(`cta: ${Object.keys(CTA_BY_SLUG).length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
