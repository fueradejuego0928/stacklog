export type PillarPage = {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  relatedPillarSlugs: string[];
  relatedPostSlugs: string[];
  sections: {
    heading: string;
    body: string;
  }[];
  relatedCategories: string[];
};

export const PILLAR_PAGES: PillarPage[] = [
  {
    slug: "workflow-optimization",
    title: "業務ワークフロー最適化とは？SaaS・AI・変更監視で業務を効率化する方法",
    description:
      "業務ワークフロー最適化の基本を、SaaS比較、AI自動化、変更監視、証跡管理の観点から整理します。",
    categorySlug: "workflow-design",
    relatedPillarSlugs: [
      "hr-labor-workflow-saas",
      "e-signature-workflow",
      "invoice-expense-workflow-saas",
      "ai-business-automation-tools",
      "web-pdf-change-monitoring-tools",
      "compliance-workflow-guide",
    ],
    relatedPostSlugs: [
      "back-office/smarthr-pricing-plan",
      "back-office/cloudsign-pricing-plan",
      "back-office/bakuraku-vs-bill-one",
      "back-office/money-forward-expense-workflow",
      "ai-automation/google-apps-script-business-automation",
      "ai-saas/pdf-monitoring-automation",
      "ai-saas/website-change-detection-tools-comparison",
      "ai-saas/dify-how-to-use-japanese",
      "ai-saas/free-ai-tools-work-efficiency",
    ],
    relatedCategories: ["workflow-design", "back-office", "ai-automation", "monitoring-evidence"],
    sections: [
      {
        heading: "業務ワークフロー最適化とは",
        body: "業務ワークフロー最適化とは、担当者の作業だけでなく、入力、確認、承認、通知、証跡保存までを一つの流れとして整理することです。",
      },
      {
        heading: "なぜSaaS比較だけでは不十分なのか",
        body: "SaaSを導入しても、誰が何を確認し、どの更新を追跡し、どの証跡を残すかが曖昧なままだと運用は改善しません。",
      },
      {
        heading: "Back Officeの最適化",
        body: "会計、契約、人事労務では、料金や機能の比較に加えて、承認フロー、権限管理、更新確認、監査対応を設計します。",
      },
      {
        heading: "AI Automationの導入",
        body: "AIは要約や分類だけでなく、定型レポート、社内共有、確認依頼の下書きなど、業務フローの一部として扱うと定着しやすくなります。",
      },
      {
        heading: "Monitoring & Evidenceの重要性",
        body: "PDF、規約、価格表、ベンダー要件の変更は業務判断の前提を変えます。継続監視と証跡管理により、見落としと説明不足を減らせます。",
      },
    ],
  },
  {
    slug: "hr-labor-workflow-saas",
    title: "人事労務ワークフローを効率化するSaaS比較",
    description:
      "人事労務の入退社、勤怠、給与、年末調整、電子申請の流れをSaaS比較の観点で整理します。",
    categorySlug: "back-office",
    relatedPillarSlugs: ["workflow-optimization", "invoice-expense-workflow-saas", "e-signature-workflow"],
    relatedPostSlugs: [
      "back-office/smarthr-pricing-plan",
      "back-office/smarthr-review-reputation",
    ],
    relatedCategories: ["back-office", "saas-comparison"],
    sections: [
      {
        heading: "人事労務ワークフローの全体像",
        body: "人事労務は、従業員情報、勤怠、給与、社会保険、年末調整が連動するため、単一機能ではなくデータ連携の流れで比較します。",
      },
      {
        heading: "比較すべきポイント",
        body: "料金、対応業務、電子申請、従業員セルフサービス、権限管理、外部ツール連携、サポート体制を確認します。",
      },
      {
        heading: "導入前チェック",
        body: "既存の給与計算、勤怠、会計システムとの連携可否と、移行時のマスタ整備を事前に確認します。",
      },
    ],
  },
  {
    slug: "e-signature-workflow",
    title: "電子契約ワークフローを効率化するツール比較",
    description:
      "電子契約の作成、承認、送信、保管、監査証跡までを効率化するツール選定ポイントを整理します。",
    categorySlug: "back-office",
    relatedPillarSlugs: ["workflow-optimization", "invoice-expense-workflow-saas", "compliance-workflow-guide"],
    relatedPostSlugs: [
      "back-office/cloudsign-pricing-plan",
      "ai-saas/pdf-monitoring-automation",
      "ai-saas/website-change-detection-tools-comparison",
    ],
    relatedCategories: ["back-office", "monitoring-evidence", "saas-comparison"],
    sections: [
      {
        heading: "電子契約ワークフローの課題",
        body: "契約書は締結前の承認、送信後のステータス確認、締結後の保管、規約や雛形の更新管理までが業務範囲です。",
      },
      {
        heading: "比較軸",
        body: "送信件数、本人確認、ワークフロー承認、テンプレート管理、保管検索、監査ログ、料金体系を比較します。",
      },
      {
        heading: "向いていないケース",
        body: "契約数が少なく、承認や保管のルールが未整備な場合は、先に業務フローを整理した方が導入効果を出しやすくなります。",
      },
    ],
  },
  {
    slug: "invoice-expense-workflow-saas",
    title: "請求書・経費精算ワークフローを効率化するSaaS比較",
    description:
      "請求書処理、経費精算、会計連携を効率化するSaaS比較と導入前チェックを整理します。",
    categorySlug: "back-office",
    relatedPillarSlugs: ["workflow-optimization", "hr-labor-workflow-saas", "e-signature-workflow"],
    relatedPostSlugs: [
      "back-office/bakuraku-vs-bill-one",
      "back-office/money-forward-expense-workflow",
      "fukugyou/side-job-tax-return-how-much-company-employee",
    ],
    relatedCategories: ["back-office", "saas-comparison"],
    sections: [
      {
        heading: "請求書・経費精算のボトルネック",
        body: "紙、メール、承認、支払、仕訳が分断されると、確認漏れや二重入力が増えます。",
      },
      {
        heading: "比較軸",
        body: "OCR、承認フロー、会計連携、インボイス制度対応、電子帳簿保存法対応、料金、サポートを確認します。",
      },
      {
        heading: "導入前チェック",
        body: "承認者、勘定科目、支払スケジュール、証憑保存のルールを先に定義します。",
      },
    ],
  },
  {
    slug: "ai-business-automation-tools",
    title: "AI業務自動化ツール比較",
    description:
      "ChatGPT、Claude、Gemini、Dify、GAS、Zapier、Makeなどを業務自動化に使う比較軸を整理します。",
    categorySlug: "ai-automation",
    relatedPillarSlugs: ["workflow-optimization", "web-pdf-change-monitoring-tools"],
    relatedPostSlugs: [
      "ai-automation/google-apps-script-business-automation",
      "ai-saas/dify-how-to-use-japanese",
      "ai-saas/free-ai-tools-work-efficiency",
      "ai-saas/chatgpt-vs-claude-difference",
      "ai-saas/notion-ai-how-to-use",
      "ai-saas/ai-writing-tools-comparison",
    ],
    relatedCategories: ["ai-automation", "workflow-design"],
    sections: [
      {
        heading: "AI業務自動化で解決できる課題",
        body: "文章作成、要約、分類、社内ナレッジ検索、レポート作成、通知文作成など、定型作業の前後工程を効率化できます。",
      },
      {
        heading: "ツール比較の考え方",
        body: "LLM単体、ノーコードAIアプリ、GAS、iPaaSを、扱うデータ、社内権限、運用頻度、保守性で比較します。",
      },
      {
        heading: "相談が必要なケース",
        body: "複数部署をまたぐ業務、個人情報を扱う処理、既存SaaSとの連携が多い処理は、要件整理から進める必要があります。",
      },
    ],
  },
  {
    slug: "web-pdf-change-monitoring-tools",
    title: "Web・PDF変更監視ツール比較",
    description:
      "Web変更検知、PDF監視、AI要約、監査証跡、価格変更監視で選ぶツール比較の軸を整理します。",
    categorySlug: "monitoring-evidence",
    relatedPillarSlugs: ["workflow-optimization", "compliance-workflow-guide", "ai-business-automation-tools"],
    relatedPostSlugs: [
      "ai-saas/website-change-detection-tools-comparison",
      "ai-saas/pdf-monitoring-automation",
    ],
    relatedCategories: ["monitoring-evidence", "quiet-archive-lab"],
    sections: [
      {
        heading: "なぜ変更監視が必要か",
        body: "規約、価格、仕様、制度資料の変更は、気づくのが遅れるほど判断ミスや説明不足につながります。",
      },
      {
        heading: "ツール選定の比較軸",
        body: "Web監視、PDF監視、差分表示、AI要約、通知先、履歴保存、監査証跡、料金を比較します。",
      },
      {
        heading: "Quiet Archiveが向いているケース",
        body: "PDFやWebページの変更を継続監視し、更新履歴、差分、AI要約を残したい場合に向いています。",
      },
    ],
  },
  {
    slug: "compliance-workflow-guide",
    title: "Compliance Workflow設計ガイド",
    description:
      "規約変更、法改正、ベンダー要件、監査証跡を継続管理するCompliance Workflowの設計方法を整理します。",
    categorySlug: "monitoring-evidence",
    relatedPillarSlugs: ["workflow-optimization", "web-pdf-change-monitoring-tools", "e-signature-workflow"],
    relatedPostSlugs: [
      "ai-saas/pdf-monitoring-automation",
      "ai-saas/website-change-detection-tools-comparison",
    ],
    relatedCategories: ["monitoring-evidence", "quiet-archive-lab", "workflow-design"],
    sections: [
      {
        heading: "Compliance Workflowとは",
        body: "Compliance Workflowは、規制や契約条件の変更を検知し、レビュー、判断、対応、証跡保存までをつなぐ運用設計です。",
      },
      {
        heading: "残すべき証跡",
        body: "いつ、どのURLやPDFが、どのように変わり、誰が確認し、どの判断をしたかを残します。",
      },
      {
        heading: "小さく始める方法",
        body: "まず重要な規約、制度PDF、ベンダー要件ページを数件選び、監視、通知、レビュー担当を決めます。",
      },
    ],
  },
];

export function getPillarPage(slug: string): PillarPage | undefined {
  return PILLAR_PAGES.find((page) => page.slug === slug);
}

export function getPillarPagesByCategory(categorySlug: string): PillarPage[] {
  return PILLAR_PAGES.filter(
    (page) =>
      page.categorySlug === categorySlug ||
      page.relatedCategories.includes(categorySlug),
  );
}
