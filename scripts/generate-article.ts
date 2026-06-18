import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import { execSync } from "child_process";

const client = new Anthropic();

const CATEGORIES: Record<string, string> = {
  "ai-saas": "AI・SaaSツール",
  "fukugyou": "副業・フリーランス",
};

async function generateArticle(keyword: string, category: string) {
  console.log("キーワード: " + keyword);
  console.log("カテゴリ: " + CATEGORIES[category]);

  console.log("Step 1: 記事構成を生成中...");
  const outlineRes = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: "アフィリエイトメディアStacklogの記事構成をJSONのみで返してください。キーワード:" + keyword + " カテゴリ:" + CATEGORIES[category] + ' 形式:{"title":"タイトル","description":"説明120字以内","slug":"english-slug","tags":["tag1"],"headings":["## 見出し1","## まとめ"]}'
    }]
  });

  const outlineText = outlineRes.content[0].type === "text" ? outlineRes.content[0].text : "";
  const outline = JSON.parse(outlineText.replace(/```json\n?|\n?```/g, "").trim());
  console.log("タイトル: " + outline.title);

  console.log("Step 2: 本文を生成中...");
  const bodyRes = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: "タイトル:" + outline.title + " キーワード:" + keyword + " 構成:" + outline.headings.join(",") + " 条件:3000文字以上のMDX形式、frontmatterなし、まとめ末尾にCTA"
    }]
  });

  const body = bodyRes.content[0].type === "text" ? bodyRes.content[0].text : "";
  console.log("本文生成完了: " + body.length + "文字");

  console.log("Step 3: MDXファイルを保存中...");
  const today = new Date().toISOString().split("T")[0];
  const dirPath = path.join("content", "posts", category);
  const filePath = path.join(dirPath, outline.slug + ".mdx");

  fs.mkdirSync(dirPath, { recursive: true });

  const content = "---\ntitle: \"" + outline.title + "\"\ndate: " + today + "\ndescription: \"" + outline.description + "\"\ncategory: \"" + category + "\"\ntags: " + JSON.stringify(outline.tags) + "\npublished: true\n---\n\n" + body;

  fs.writeFileSync(filePath, content);
  console.log("保存: " + filePath);

  console.log("Step 4: Contentlayerビルド中...");
  execSync("npx contentlayer2 build", { stdio: "inherit" });

  console.log("Step 5: Vercelデプロイ中...");
  execSync("vercel --prod --yes", { stdio: "inherit" });

  console.log("完了: https://stacklogs.net/posts/" + category + "/" + outline.slug);
}

const keyword = process.argv[2];
const category = process.argv[3];

if (!keyword || !category || !CATEGORIES[category]) {
  console.error("使い方: npx tsx scripts/generate-article.ts <キーワード> <カテゴリ>");
  console.error("カテゴリ: ai-saas | fukugyou");
  process.exit(1);
}

generateArticle(keyword, category).catch(console.error);
