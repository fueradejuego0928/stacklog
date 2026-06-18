#!/usr/bin/env tsx
/**
 * wp-fix-content.ts — 投稿済み19本の本文を修正する
 *
 * 修正内容:
 *   1. 冒頭 <h1>...</h1> の重複タイトルを削除
 *   2. PR表記 blockquote (> **※PR表記：**...) を削除
 *      (テーマ single.php が自動挿入するため不要)
 *
 * 使い方:
 *   tsx scripts/wp-fix-content.ts          # 全19本
 *   tsx scripts/wp-fix-content.ts --dry    # 変更内容を確認するだけ（更新しない）
 *   tsx scripts/wp-fix-content.ts --slug=xxx  # 1本だけ
 */

import fs from 'fs'
import path from 'path'

// ── .env.local 読み込み ───────────────────────────────────
function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_a-z][A-Z_a-z0-9]*)=(.*)$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '').trim()
    }
  }
}

loadEnvLocal()

const WP_BASE = 'https://stacklogs.net'
const WP_USER = process.env.WP_USER
const WP_PASS = process.env.WP_APP_PASSWORD

if (!WP_USER || !WP_PASS) {
  console.error('❌ WP_USER と WP_APP_PASSWORD を .env.local に設定してください')
  process.exit(1)
}

const AUTH = `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')}`

// ── 対象スラッグ一覧 ──────────────────────────────────────
const TARGET_SLUGS = [
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
]

// ── 本文修正ロジック ──────────────────────────────────────
function fixContent(html: string): { fixed: string; changes: string[] } {
  let fixed = html
  const changes: string[] = []

  // 1. PR表記 blockquote を先に削除
  //    （H1 より前に来ているケースがあるため先に処理する）
  const prBlockRe = /<blockquote[^>]*>[\s\S]*?(?:※PR表記|アフィリエイト広告|本記事には)[\s\S]*?<\/blockquote>\s*/gi
  if (prBlockRe.test(fixed)) {
    fixed = fixed.replace(prBlockRe, '')
    changes.push('PR表記 blockquote 削除')
  }

  // 2. 冒頭 <h1>...</h1> を削除（blockquote 除去後に再チェック）
  const h1Match = fixed.match(/^(\s*<h1[^>]*>[\s\S]*?<\/h1>\s*)/)
  if (h1Match) {
    fixed = fixed.slice(h1Match[0].length)
    changes.push('H1重複タイトル削除')
  }

  // 3. 先頭・末尾の余分な空白を整理
  fixed = fixed.trim()

  return { fixed, changes }
}

// ── スラッグ → 投稿情報取得 ───────────────────────────────
interface WPPost {
  id: number
  link: string
  content: { rendered: string; raw?: string }
  title: { rendered: string }
}

async function fetchPost(slug: string): Promise<WPPost | null> {
  // 公開記事は認証不要で取得（context=edit は不要かつ auth 必須で 401 になる）
  const res = await fetch(
    `${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&per_page=1`
  )
  if (!res.ok) {
    throw new Error(`記事取得失敗 (${res.status}): ${slug}`)
  }
  const posts = (await res.json()) as WPPost[]
  return posts.length > 0 ? posts[0] : null
}

// ── 投稿更新 ──────────────────────────────────────────────
async function updatePost(id: number, content: string): Promise<string> {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts/${id}`, {
    method: 'POST', // WordPress REST API は POST で PATCH 相当の部分更新
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    const e = (await res.json()) as { message?: string; code?: string }
    throw new Error(`更新失敗 (${res.status} ${e.code ?? ''}): ${e.message ?? res.statusText}`)
  }
  const post = (await res.json()) as { link: string }
  return post.link
}

// ── メイン ────────────────────────────────────────────────
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const isDry  = args.includes('--dry')
  const onlySlug = args.find(a => a.startsWith('--slug='))?.split('=')[1]

  const queue = onlySlug
    ? TARGET_SLUGS.filter(s => s === onlySlug)
    : TARGET_SLUGS

  if (queue.length === 0) {
    console.error(`❌ スラッグが見つかりません: ${onlySlug}`)
    process.exit(1)
  }

  const modeLabel = isDry ? ' [DRY RUN — 更新しない]' : ''
  console.log(`🔧 本文修正開始 (${queue.length}本)${modeLabel}`)
  console.log('─'.repeat(64))

  const updated: string[] = []
  const skipped: string[] = []
  const failed: Array<{ slug: string; error: string }> = []

  for (let i = 0; i < queue.length; i++) {
    const slug = queue[i]
    process.stdout.write(`[${i + 1}/${queue.length}] ${slug} ... `)

    try {
      const post = await fetchPost(slug)
      if (!post) {
        console.log('⚠️  記事が見つかりません')
        skipped.push(slug)
        continue
      }

      const rawContent = post.content.rendered
      const { fixed, changes } = fixContent(rawContent)

      if (changes.length === 0) {
        console.log('⏭  変更なし')
        skipped.push(slug)
      } else if (isDry) {
        console.log(`🔍 [DRY] ${changes.join(', ')}`)
      } else {
        const url = await updatePost(post.id, fixed)
        console.log(`✅ ${changes.join(', ')} → ${url}`)
        updated.push(`${post.title.rendered}\n  → ${url}`)
      }
    } catch (e) {
      const msg = (e as Error).message
      failed.push({ slug, error: msg })
      console.log(`❌ ${msg}`)
    }

    if (i < queue.length - 1) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  console.log('\n' + '═'.repeat(64))
  console.log(`✅ 更新: ${updated.length}本  ⏭ 変更なし: ${skipped.length}本  ❌ 失敗: ${failed.length}本`)

  if (updated.length > 0) {
    console.log('\n更新済み:')
    for (const u of updated) console.log(`  ${u}`)
  }
  if (failed.length > 0) {
    console.log('\n失敗:')
    for (const f of failed) console.log(`  ${f.slug}: ${f.error}`)
  }
}

main().catch(e => {
  console.error('予期しないエラー:', e)
  process.exit(1)
})
