<?php
// ── IPアドレス制限（ブラウザアクセス用） ────────────────
$allowed_ips = [
    '133.201.143.224',                          // IPv4
    '2404:7a81:8fe0:8500:bcfc:8ff8:5057:4a86',  // IPv6
];
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (PHP_SAPI !== 'cli' && !in_array($remote, $allowed_ips, true)) {
    http_response_code(403);
    die('Forbidden');
}

// dry-runモード判定（ブラウザ: ?mode=dry / CLI: --dry 引数）
$dry_run = (PHP_SAPI === 'cli')
    ? in_array('--dry', array_slice($argv ?? [], 1), true)
    : (isset($_GET['mode']) && $_GET['mode'] === 'dry');

/**
 * _fix_content_production.php
 * 本番WordPressの19記事本文を修正するスクリプト
 *
 * 使い方（本番サーバーSSH上）:
 *   php _fix_content_production.php          # 全19本修正
 *   php _fix_content_production.php --dry    # 変更内容確認のみ
 *   php _fix_content_production.php --slug=ai-image-generation-tools-recommended
 *
 * アップロード先: WordPressルート（wp-config.phpと同じディレクトリ）
 * 実行後は必ず削除すること
 */

// ── WordPress読み込み ─────────────────────────────────────
if ( ! defined('ABSPATH') ) {
    define('ABSPATH', __DIR__ . '/');
}
require_once __DIR__ . '/wp-load.php';

// ── 対象スラッグ ──────────────────────────────────────────
$target_slugs = [
    'ai-image-generation-tools-recommended',
    'ai-tools-for-side-business',
    'ai-tools-recommended-side-job',
    'ai-writing-tools-comparison',
    'chatgpt-pricing-personal-plan-guide',
    'dify-how-to-use-japanese',
    'free-ai-tools-work-efficiency',
    'notion-ai-how-to-use',
    'text-generation-ai-comparison',
    'website-change-detection-tools-comparison',
    'crowdworks-beginner-jobs-to-earn-money',
    'crowdworks-vs-lancers-comparison',
    'freelance-how-to-start-non-engineer',
    'freelance-web-director-income',
    'programming-school-recommendations-for-working-adults',
    'saas-side-job-recommended',
    'side-job-not-found-out-company-employee',
    'side-job-recommended-company-employee',
    'side-job-tax-return-how-much-company-employee',
];

// ── 引数処理 ──────────────────────────────────────────────
$args      = array_slice($argv ?? [], 1);
$only_slug = null;
// ブラウザ: ?slug=xxx / CLI: --slug=xxx
if (PHP_SAPI !== 'cli' && isset($_GET['slug'])) {
    $only_slug = $_GET['slug'];
} else {
    foreach ($args as $a) {
        if (strpos($a, '--slug=') === 0) {
            $only_slug = substr($a, 7);
        }
    }
}

$queue = $only_slug
    ? array_filter($target_slugs, fn($s) => $s === $only_slug)
    : $target_slugs;

// ── 本文修正ロジック ──────────────────────────────────────
function fix_content(string $html): array {
    $fixed   = $html;
    $changes = [];

    // 1. PR表記を削除（テーマ側の single.php で自動表示するため）
    $before = $fixed;
    $fixed = preg_replace(
        '/<blockquote[^>]*>[\s\S]*?(?:※PR表記|アフィリエイト広告|本記事には)[\s\S]*?<\/blockquote>\s*/i',
        '',
        $fixed
    );
    $fixed = preg_replace(
        '/<div[^>]*class=["\'][^"\']*sl-pr-box[^"\']*["\'][^>]*>[\s\S]*?<\/div>\s*/i',
        '',
        $fixed
    );
    $fixed = preg_replace(
        '/<p>\s*(?:&gt;|>)\s*(?:<strong>)?※PR表記[\s\S]*?<\/p>\s*/iu',
        '',
        $fixed
    );
    $fixed = preg_replace(
        '/^\s*>\s*\*\*※PR表記：?\*\*.*(?:\R>\s?.*)*\R*/mu',
        '',
        $fixed
    );
    if ($fixed !== $before) {
        $changes[] = 'PR表記削除';
    }

    // 2. H1タイトルを削除（post_titleと重複するため）
    $before = $fixed;
    $fixed = preg_replace('/<h1[^>]*>[\s\S]*?<\/h1>\s*/i', '', $fixed);
    $fixed = preg_replace('/<p>\s*#\s+[^<]+<\/p>\s*/u', '', $fixed, 1);
    $fixed = preg_replace('/^\s*#\s+.+\R+/u', '', $fixed, 1);
    if ($fixed !== $before) {
        $changes[] = 'H1重複タイトル削除';
    }

    // 3. Markdown インライン記法を HTML に変換
    //    **bold** → <strong>bold</strong>（HTMLタグ内は対象外）
    $before = $fixed;
    $fixed = preg_replace('/\*\*([^*\n<>]+)\*\*/', '<strong>$1</strong>', $fixed);
    if ($fixed !== $before) {
        $changes[] = 'Markdown bold変換';
    }

    return [ trim($fixed), $changes ];
}

// ── メイン処理 ────────────────────────────────────────────
$mode = $dry_run ? ' [DRY RUN]' : '';
echo "🔧 本文修正開始 (" . count($queue) . "本){$mode}\n";
echo str_repeat('─', 64) . "\n";

$updated = 0;
$skipped = 0;
$failed  = 0;
$results = [];

foreach (array_values($queue) as $i => $slug) {
    $num = $i + 1;
    $total = count($queue);
    echo "[{$num}/{$total}] {$slug} ... ";

    $posts = get_posts([
        'name'           => $slug,
        'post_type'      => 'post',
        'post_status'    => 'any',
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ]);

    if (empty($posts)) {
        echo "⚠️  記事が見つかりません\n";
        $skipped++;
        continue;
    }

    $post_id = $posts[0];
    $post    = get_post($post_id);
    $content = $post->post_content;

    [ $fixed, $changes ] = fix_content($content);

    if (empty($changes)) {
        echo "⏭  変更なし\n";
        $skipped++;
        continue;
    }

    if ($dry_run) {
        echo "🔍 [DRY] " . implode(', ', $changes) . "\n";
        continue;
    }

    $result = wp_update_post([
        'ID'           => $post_id,
        'post_content' => $fixed,
    ], true);

    if (is_wp_error($result)) {
        echo "❌ " . $result->get_error_message() . "\n";
        $failed++;
    } else {
        $url = get_permalink($post_id);
        echo "✅ " . implode(', ', $changes) . "\n   → {$url}\n";
        $results[] = [ 'title' => get_the_title($post_id), 'url' => $url ];
        $updated++;
    }
}

echo "\n" . str_repeat('═', 64) . "\n";
echo "✅ 更新: {$updated}本  ⏭ 変更なし: {$skipped}本  ❌ 失敗: {$failed}本\n";

if (!empty($results)) {
    echo "\n更新済み記事:\n";
    foreach ($results as $r) {
        echo "  {$r['title']}\n  → {$r['url']}\n";
    }
}
