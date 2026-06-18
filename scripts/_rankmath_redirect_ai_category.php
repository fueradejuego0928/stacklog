<?php
// StackLog one-off Rank Math redirection fixer.
// Upload to WordPress root, run once, then delete with ?delete=1.

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

define('WP_USE_THEMES', false);
require_once __DIR__ . '/wp-load.php';

$source = '/category/ai/';
$destination = home_url('/category/ai-tools/');

if (!class_exists('\\RankMath\\Redirections\\Redirection')) {
    http_response_code(500);
    die("Rank Math Redirection class unavailable\n");
}

$redirection = \RankMath\Redirections\Redirection::from([
    'sources' => [
        [
            'pattern' => $source,
            'comparison' => 'exact',
        ],
    ],
    'url_to' => $destination,
    'header_code' => '301',
    'status' => 'active',
]);

if ($redirection->is_infinite_loop()) {
    http_response_code(409);
    die("Infinite loop detected\n");
}

echo "source: {$source}\n";
echo "destination: {$destination}\n";
echo "type: 301\n";
echo "status: active\n";

if ($dry_run) {
    echo "result: dry-run only\n";
    exit;
}

$id = $redirection->save();
if (!$id) {
    http_response_code(500);
    die("result: failed\n");
}

echo "result: saved\n";
echo "id: {$id}\n";

if ($self_delete) {
    @unlink(__FILE__);
    echo "deleted: yes\n";
}
