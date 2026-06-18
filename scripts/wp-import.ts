#!/usr/bin/env tsx
/**
 * wp-import.ts — MDX → WordPress REST API インポーター
 *
 * 使い方:
 *   tsx scripts/wp-import.ts --test          # 1本目だけテスト投稿
 *   tsx scripts/wp-import.ts --slug=xxx      # 特定スラッグのみ投稿
 *   tsx scripts/wp-import.ts                 # 全20本投稿
 *
 * 事前設定 (.env.local):
 *   WP_USER=your-wordpress-username
 *   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'

// ── .env.local を読み込む ─────────────────────────────────
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
  console.error('❌ 認証情報が未設定です。.env.local に以下を追記してください:')
  console.error('   WP_USER=your-username')
  console.error('   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx')
  console.error('\n WordPress管理画面 → ユーザー → プロフィール → アプリケーションパスワード で発行できます')
  process.exit(1)
}

const AUTH = `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')}`

// ── MDX → HTML 変換 ───────────────────────────────────────
async function mdxToHtml(raw: string): Promise<string> {
  // JSX属性をHTMLに変換してからMarkdownパーサーに渡す
  const preprocessed = raw
    // import / export 文を除去
    .replace(/^import\s+[^\n]+$/gm, '')
    .replace(/^export\s+default\s+[^\n]+$/gm, '')
    // MDXコメント {/* ... */} を除去
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    // className= → class=
    .replace(/className=/g, 'class=')
    // JSX style={{ camelCase: 'value' }} → style="kebab-case: value"
    .replace(/style=\{\{([^}]+)\}\}/g, (_: string, inner: string) => {
      const css = inner
        .split(',')
        .map((prop: string) => {
          const [k, ...rest] = prop.split(':')
          const key = k.trim().replace(/['"]/g, '')
          const val = rest.join(':').trim().replace(/['"]/g, '')
          const kebab = key.replace(/([A-Z])/g, (c: string) => `-${c.toLowerCase()}`)
          return `${kebab}: ${val}`
        })
        .filter(Boolean)
        .join('; ')
      return `style="${css}"`
    })
    // JSX self-closing img を HTML img に
    .replace(/<img([^>]*)\s*\/>/g, '<img$1>')
    .trim()

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(preprocessed)

  return String(result)
}

// ── カテゴリを取得 / 作成 ─────────────────────────────────
async function getOrCreateCategory(slug: string, name: string): Promise<number> {
  const res = await fetch(
    `${WP_BASE}/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}`,
    { headers: { Authorization: AUTH } }
  )
  const cats = (await res.json()) as Array<{ id: number }>
  if (cats.length > 0) return cats[0].id

  const create = await fetch(`${WP_BASE}/wp-json/wp/v2/categories`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, slug }),
  })
  if (!create.ok) {
    const e = (await create.json()) as { message?: string }
    throw new Error(`カテゴリ作成失敗 [${slug}]: ${e.message}`)
  }
  const created = (await create.json()) as { id: number }
  console.log(`  📁 カテゴリ作成: ${slug} (id:${created.id})`)
  return created.id
}

// ── スラッグ重複チェック ──────────────────────────────────
async function slugExists(slug: string): Promise<boolean> {
  const res = await fetch(
    `${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=any&per_page=1`,
    { headers: { Authorization: AUTH } }
  )
  const posts = (await res.json()) as unknown[]
  return Array.isArray(posts) && posts.length > 0
}

// ── 1記事投稿 ─────────────────────────────────────────────
interface PostResult {
  title: string
  url: string
  skipped?: boolean
}

async function importPost(filePath: string, categoryId: number): Promise<PostResult> {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: fm, content } = matter(raw)
  const slug = path.basename(filePath, '.mdx')

  if (await slugExists(slug)) {
    return { title: fm.title as string, url: '', skipped: true }
  }

  const htmlContent = await mdxToHtml(content)
  const dateStr = fm.date
    ? new Date(fm.date as string).toISOString().replace(/\.\d{3}Z$/, '')
    : new Date().toISOString().replace(/\.\d{3}Z$/, '')

  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: fm.title,
      content: htmlContent,
      status: 'publish',
      categories: [categoryId],
      date: dateStr,
      slug,
    }),
  })

  if (!res.ok) {
    const e = (await res.json()) as { message?: string; code?: string }
    throw new Error(`HTTP ${res.status} (${e.code ?? ''}): ${e.message ?? res.statusText}`)
  }

  const post = (await res.json()) as { id: number; link: string }
  return { title: fm.title as string, url: post.link }
}

// ── MDXファイル収集 ───────────────────────────────────────
function collectFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .sort()
    .map(f => path.join(dir, f))
}

// ── メイン ────────────────────────────────────────────────
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const isTest = args.includes('--test')
  const onlySlug = args.find(a => a.startsWith('--slug='))?.split('=')[1]

  const CONTENT_ROOT = path.join(process.cwd(), 'content/posts')

  // カテゴリID確認/作成
  console.log('🔍 カテゴリ確認中...')
  const aiSaasId   = await getOrCreateCategory('ai-saas', 'AI・SaaSツール')
  const fukugyouId = await getOrCreateCategory('fukugyou', '複業')
  console.log(`  ai-saas: id=${aiSaasId}, fukugyou: id=${fukugyouId}\n`)

  // 投稿キュー構築
  const allTargets: Array<{ file: string; catId: number }> = [
    ...collectFiles(path.join(CONTENT_ROOT, 'ai-saas')).map(f => ({ file: f, catId: aiSaasId })),
    ...collectFiles(path.join(CONTENT_ROOT, 'fukugyou')).map(f => ({ file: f, catId: fukugyouId })),
  ]

  const queue = onlySlug
    ? allTargets.filter(t => path.basename(t.file, '.mdx') === onlySlug)
    : isTest
    ? allTargets.slice(0, 1)
    : allTargets

  if (queue.length === 0) {
    console.error(`❌ 対象ファイルが見つかりません (--slug=${onlySlug ?? ''})`)
    process.exit(1)
  }

  const modeLabel = isTest ? ' [テスト: 1本のみ]' : onlySlug ? ` [--slug=${onlySlug}]` : ` [全${queue.length}本]`
  console.log(`📦 投稿開始${modeLabel}`)
  console.log('─'.repeat(64))

  const posted: PostResult[] = []
  const failed: Array<{ slug: string; error: string }> = []

  for (let i = 0; i < queue.length; i++) {
    const { file, catId } = queue[i]
    const slug = path.basename(file, '.mdx')
    process.stdout.write(`[${i + 1}/${queue.length}] ${slug} ... `)

    try {
      const result = await importPost(file, catId)
      if (result.skipped) {
        console.log('⏭  スキップ（既存）')
      } else {
        posted.push(result)
        console.log(`✅ ${result.url}`)
      }
    } catch (e) {
      const msg = (e as Error).message
      failed.push({ slug, error: msg })
      console.log(`❌ ${msg}`)
    }

    if (i < queue.length - 1) {
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  // 結果サマリー
  console.log('\n' + '═'.repeat(64))
  console.log(`✅ 投稿成功: ${posted.length}本  ❌ 失敗: ${failed.length}本`)
  if (posted.length > 0) {
    console.log('\n投稿一覧:')
    for (const r of posted) {
      console.log(`  ${r.title}`)
      console.log(`  → ${r.url}`)
    }
  }
  if (failed.length > 0) {
    console.log('\n失敗一覧:')
    for (const f of failed) {
      console.log(`  ${f.slug}: ${f.error}`)
    }
  }
}

main().catch(e => {
  console.error('予期しないエラー:', e)
  process.exit(1)
})
