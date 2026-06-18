import { execSync } from "child_process";

const articles = [
  { keyword: "文章生成AI 比較", category: "ai-saas" },
  { keyword: "ChatGPT 料金 個人", category: "ai-saas" },
  { keyword: "Notion AI 使い方", category: "ai-saas" },
  { keyword: "AIライティングツール 比較", category: "ai-saas" },
  { keyword: "ChatGPT vs Claude 違い", category: "ai-saas" },
  { keyword: "AI 画像生成ツール おすすめ", category: "ai-saas" },
  { keyword: "Dify 使い方 日本語", category: "ai-saas" },
  { keyword: "AIツール 無料 仕事効率化", category: "ai-saas" },
  { keyword: "サイト変更検知ツール 比較", category: "ai-saas" },
  { keyword: "副業 おすすめ 会社員", category: "fukugyou" },
  { keyword: "クラウドワークス ランサーズ 比較", category: "fukugyou" },
  { keyword: "プログラミングスクール 社会人 おすすめ", category: "fukugyou" },
  { keyword: "フリーランス 始め方 エンジニア以外", category: "fukugyou" },
  { keyword: "副業 バレない 会社員", category: "fukugyou" },
  { keyword: "Webディレクター フリーランス 収入", category: "fukugyou" },
  { keyword: "副業 確定申告 会社員 いくらから", category: "fukugyou" },
  { keyword: "クラウドワークス 初心者 稼げる仕事", category: "fukugyou" },
  { keyword: "SaaS 副業 おすすめ", category: "fukugyou" },
];

console.log(`合計 ${articles.length} 記事を生成します`);

for (let i = 0; i < articles.length; i++) {
  const { keyword, category } = articles[i];
  console.log(`\n[${i + 1}/${articles.length}] ${keyword}`);
  try {
    execSync(
      `npx tsx scripts/generate-article.ts "${keyword}" ${category}`,
      { stdio: "inherit" }
    );
    // API制限対策で10秒待機
    if (i < articles.length - 1) {
      console.log("10秒待機中...");
      execSync("sleep 10");
    }
  } catch (err) {
    console.error(`エラー: ${keyword} — スキップして続行`);
  }
}

console.log("\n全記事生成・デプロイ完了！");
