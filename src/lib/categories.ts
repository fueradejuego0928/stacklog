export type CategoryMeta = {
  label: string;
  shortLabel: string;
  description: string;
  priority: "primary" | "secondary" | "legacy";
  canonicalSlug?: string;
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "workflow-design": {
    label: "Workflow Design",
    shortLabel: "Workflow",
    description:
      "業務フロー設計、業務改善、ツール選定フロー、中小企業の運用設計を整理するカテゴリ。",
    priority: "primary",
  },
  "back-office": {
    label: "Back Office",
    shortLabel: "Back Office",
    description:
      "会計、請求書、経費精算、人事労務、給与計算、電子契約の業務フローを扱うカテゴリ。",
    priority: "primary",
  },
  "ai-automation": {
    label: "AI Automation",
    shortLabel: "AI Automation",
    description:
      "ChatGPT、Claude、Gemini、Dify、GAS、Zapier、Makeなどを業務自動化に組み込むカテゴリ。",
    priority: "primary",
  },
  "monitoring-evidence": {
    label: "Monitoring & Evidence",
    shortLabel: "Monitoring",
    description:
      "PDF監視、Web変更検知、規約変更監視、価格変更監視、競合サイト監視、監査証跡を扱うカテゴリ。",
    priority: "primary",
  },
  "saas-comparison": {
    label: "SaaS Comparison",
    shortLabel: "SaaS比較",
    description:
      "料金比較、評判・口コミ、おすすめランキング、使い方、導入比較を扱うカテゴリ。",
    priority: "primary",
  },
  "quiet-archive-lab": {
    label: "Quiet Archive Lab",
    shortLabel: "QA Lab",
    description:
      "Quiet Archive活用、変更監視実践、PDF監視ワークフロー、Compliance Workflow実践を扱うカテゴリ。",
    priority: "primary",
  },
  "pdf-document-monitoring": {
    label: "Monitoring & Evidence",
    shortLabel: "PDF監視",
    description:
      "PDF差し替え、規程文書、仕様書、制度資料の変更を見逃さないための監視設計。",
    priority: "secondary",
    canonicalSlug: "monitoring-evidence",
  },
  "monitoring-change-detection": {
    label: "Monitoring & Evidence",
    shortLabel: "変更検知",
    description:
      "Webページ、価格表、規制ページ、告知文の変更を継続的に検知する運用ノウハウ。",
    priority: "secondary",
    canonicalSlug: "monitoring-evidence",
  },
  "compliance-audit": {
    label: "Monitoring & Evidence",
    shortLabel: "Compliance",
    description:
      "法改正PDF、監査証跡、レビュー履歴、社内説明に耐える変更管理Workflow。",
    priority: "secondary",
    canonicalSlug: "monitoring-evidence",
  },
  "vendor-procurement-workflow": {
    label: "Monitoring & Evidence",
    shortLabel: "Vendor",
    description:
      "ベンダー要件、価格改定、仕様変更、調達判断に関わる情報の監視と共有。",
    priority: "secondary",
    canonicalSlug: "monitoring-evidence",
  },
  "ai-workflow": {
    label: "AI Automation",
    shortLabel: "AI Automation",
    description:
      "AI要約、分類、通知、判断支援を業務フローに組み込むための実務設計。",
    priority: "secondary",
    canonicalSlug: "ai-automation",
  },
  "workflow-automation": {
    label: "AI Automation",
    shortLabel: "自動化",
    description:
      "手動確認、転記、共有、レビューを減らすための業務自動化パターン。",
    priority: "secondary",
    canonicalSlug: "ai-automation",
  },
  "web-operations": {
    label: "Monitoring & Evidence",
    shortLabel: "Web運用",
    description:
      "Webサイト運用、競合ページ確認、公開情報の継続監視に関する実務メモ。",
    priority: "secondary",
    canonicalSlug: "monitoring-evidence",
  },
  "e-signature-document-management": {
    label: "Back Office",
    shortLabel: "書類管理",
    description:
      "契約書、申請書、電子署名、文書管理フローで発生する確認漏れを減らす方法。",
    priority: "secondary",
    canonicalSlug: "back-office",
  },
  "crm-ma": {
    label: "SaaS Comparison",
    shortLabel: "CRM・MA",
    description: "CRMやMAの選定、運用、比較に関する記事。",
    priority: "legacy",
    canonicalSlug: "saas-comparison",
  },
  accounting: {
    label: "Back Office",
    shortLabel: "会計",
    description: "会計、経費精算、請求管理に関する記事。",
    priority: "legacy",
    canonicalSlug: "back-office",
  },
  "hr-labor": {
    label: "Back Office",
    shortLabel: "人事・労務",
    description: "人事、労務、バックオフィス業務に関する記事。",
    priority: "legacy",
    canonicalSlug: "back-office",
  },
  "ai-saas": {
    label: "AI Automation",
    shortLabel: "AI Automation",
    description:
      "AIツール単体ではなく、業務フローにどう組み込むかを中心に整理した記事。",
    priority: "legacy",
    canonicalSlug: "ai-automation",
  },
  fukugyou: {
    label: "Archive",
    shortLabel: "Archive",
    description:
      "過去に公開した副業関連の記事。現在のStacklogでは優先度を下げています。",
    priority: "legacy",
  },
};

export const PRIMARY_CATEGORY_SLUGS = Object.entries(CATEGORY_META)
  .filter(([, meta]) => meta.priority === "primary")
  .map(([slug]) => slug);

export const SECONDARY_CATEGORY_SLUGS = Object.entries(CATEGORY_META)
  .filter(([, meta]) => meta.priority === "secondary")
  .map(([slug]) => slug);

export function getCategoryMeta(slug: string): CategoryMeta {
  return (
    CATEGORY_META[slug] ?? {
      label: slug,
      shortLabel: slug,
      description: "Workflow problemに関する記事。",
      priority: "legacy",
    }
  );
}

export function getCanonicalCategorySlug(slug: string): string {
  return CATEGORY_META[slug]?.canonicalSlug ?? slug;
}
