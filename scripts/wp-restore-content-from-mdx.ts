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

const WP_BASE = process.env.WP_BASE_URL || "https://stacklogs.net";
const APPLY = process.argv.includes("--apply");
const ONLY_SLUG = process.argv
  .find((arg) => arg.startsWith("--slug="))
  ?.split("=")[1];

const TARGET_SLUGS = [
  "side-job-tax-return-how-much-company-employee",
  "side-job-recommended-company-employee",
  "side-job-not-found-out-company-employee",
  "saas-side-job-recommended",
  "programming-school-recommendations-for-working-adults",
  "freelance-web-director-income",
  "freelance-how-to-start-non-engineer",
  "crowdworks-vs-lancers-comparison",
];

type WpPost = {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { raw?: string; rendered?: string };
};

function loadEnvLocal(): void {
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

function authHeader(): Record<string, string> {
  const user = process.env.WP_USER;
  const password = process.env.WP_APP_PASSWORD;
  if (!user || !password) return {};
  const token = Buffer.from(`${user}:${password}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

function findMdxBySlug(slug: string): string | null {
  const root = path.join(process.cwd(), "content/posts");
  const categories = fs.readdirSync(root);
  for (const category of categories) {
    const file = path.join(root, category, `${slug}.mdx`);
    if (fs.existsSync(file)) return file;
  }
  return null;
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

async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return (await res.json()) as T;
}

async function fetchPost(slug: string): Promise<WpPost | null> {
  const posts = await fetchJson<WpPost[]>(
    `${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&per_page=1`
  );
  return posts[0] || null;
}

async function updatePost(id: number, content: string): Promise<WpPost> {
  return fetchJson<WpPost>(`${WP_BASE}/wp-json/wp/v2/posts/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ content }),
  });
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function main() {
  if (APPLY && (!process.env.WP_USER || !process.env.WP_APP_PASSWORD)) {
    throw new Error("--apply requires WP_USER and WP_APP_PASSWORD");
  }

  const queue = ONLY_SLUG ? TARGET_SLUGS.filter((slug) => slug === ONLY_SLUG) : TARGET_SLUGS;
  if (queue.length === 0) {
    throw new Error(`target slug not found: ${ONLY_SLUG}`);
  }

  console.log(`# wp-restore-content-from-mdx ${APPLY ? "apply" : "dry-run"}`);
  console.log(`site: ${WP_BASE}`);
  console.log(`targets: ${queue.length}`);
  console.log("");

  for (const slug of queue) {
    const file = findMdxBySlug(slug);
    if (!file) {
      console.log(`- ${slug}: missing local MDX`);
      continue;
    }

    const source = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(source);
    const nextHtml = await mdxToHtml(content);
    const post = await fetchPost(slug);
    if (!post) {
      console.log(`- ${slug}: missing WordPress post`);
      continue;
    }

    const current = post.content.rendered || "";
    const hasContamination =
      current.includes("post_name=&#8217;crowdworks-vs-lancers-comparison") ||
      current.includes("post_name='crowdworks-vs-lancers-comparison") ||
      current.includes("LANCERS_AFFILIATE_URL") ||
      current.includes("CW_AFFILIATE_URL_PLACEHOLDER") ||
      current.includes("href=\"#\"");

    console.log(
      `- ${post.id} / ${slug} / ${stripHtml(String(data.title || post.title.rendered)).slice(0, 80)}`
    );
    console.log(`  local: ${path.relative(process.cwd(), file)}`);
    console.log(`  contamination_or_placeholder: ${hasContamination ? "yes" : "no"}`);

    if (APPLY) {
      await updatePost(post.id, nextHtml);
      console.log(`  restored: ${post.link}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
