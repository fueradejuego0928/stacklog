import TrackedLink from "@/components/TrackedLink";
import { getCanonicalCategorySlug } from "@/lib/categories";

type CtaType = "affiliate" | "quiet_archive" | "ai_consult";

type ArticleCTAProps = {
  articleSlug: string;
  articleCategory: string;
  position?: string;
};

const CTA_BY_TYPE: Record<
  CtaType,
  {
    title: string;
    description: string;
  }
> = {
  affiliate: {
    title: "公式サイトで料金を確認する",
    description: "最新の料金、無料トライアル、契約条件は公式サイトで確認してください。比較記事もあわせて見ると判断しやすくなります。",
  },
  quiet_archive: {
    title: "PDF・Webページの変更監視を試す",
    description:
      "Quiet Archiveは関連サービスです。PDF、Webページ、規約、価格表の変更検知と履歴保存を運用フローに組み込めます。",
  },
  ai_consult: {
    title: "自社の業務フローに合うか相談する",
    description:
      "AIツール単体ではなく、業務整理、データ入力、通知、レポート化まで含めた実務フローとして設計します。",
  },
};

type CtaLink = {
  label: string;
  href: string;
  buttonClass: string;
  eventName: string;
  ctaType?: CtaType | "related_article";
};

function resolveQuietArchiveTerm(articleSlug: string) {
  if (articleSlug.includes("pdf")) return "pdf_monitoring";
  if (articleSlug.includes("smarthr") || articleSlug.includes("cloudsign")) return "pricing_terms_monitoring";
  return "website_monitoring";
}

function buildQuietArchiveUrl(path: string, articleSlug: string, position: string, action: string) {
  const normalizedSlug = articleSlug.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const normalizedPosition = position.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const params = new URLSearchParams({
    utm_source: "stacklogs",
    utm_medium: "referral",
    utm_campaign: "quiet_archive_pr",
    utm_content: `article_${normalizedSlug}_${normalizedPosition}_${action}`,
    utm_term: resolveQuietArchiveTerm(articleSlug),
  });

  return `https://www.quietarchive.net${path}?${params.toString()}`;
}

function getAffiliateLinks(articleSlug: string, position: string): CtaLink[] {
  const baseComparisonLink: CtaLink = {
    label: "比較記事を確認する",
    href: "/posts?category=saas-comparison",
    buttonClass: "sl-btn-navy",
    eventName: "related_article_click",
    ctaType: "related_article",
  };

  const pricingMonitorLink: CtaLink = {
    label: "料金・規約変更を監視する",
    href: buildQuietArchiveUrl("/signup", articleSlug, position, "pricing_terms_cta"),
    buttonClass: "sl-btn-navy",
    eventName: "cta_clicked",
    ctaType: "quiet_archive",
  };

  if (articleSlug.includes("cloudsign")) {
    return [
      {
        label: "無料プラン・最新料金を確認する",
        href: "https://www.cloudsign.jp/",
        buttonClass: "sl-btn-teal",
        eventName: "affiliate_cta_click",
      },
      {
        label: "比較の軸を見る",
        href: "/pillars/e-signature-workflow",
        buttonClass: "sl-btn-navy",
        eventName: "related_article_click",
        ctaType: "related_article",
      },
      pricingMonitorLink,
    ];
  }

  if (articleSlug.includes("smarthr")) {
    const secondaryHref = articleSlug.includes("review")
      ? "/posts/back-office/smarthr-pricing-plan"
      : "/posts/back-office/smarthr-review-reputation";

    return [
      {
        label: articleSlug.includes("review")
          ? "公式サイトで機能を確認する"
          : "資料請求・無料トライアルを確認する",
        href: "https://smarthr.jp/",
        buttonClass: "sl-btn-teal",
        eventName: "affiliate_cta_click",
      },
      {
        label: articleSlug.includes("review") ? "料金プランを見る" : "評判・口コミを見る",
        href: secondaryHref,
        buttonClass: "sl-btn-navy",
        eventName: "related_article_click",
        ctaType: "related_article",
      },
      pricingMonitorLink,
    ];
  }

  if (articleSlug.includes("money-forward")) {
    return [
      {
        label: "料金・機能を公式サイトで確認する",
        href: "https://biz.moneyforward.com/expense/",
        buttonClass: "sl-btn-teal",
        eventName: "affiliate_cta_click",
      },
      {
        label: "経費精算の比較を見る",
        href: "/pillars/invoice-expense-workflow-saas",
        buttonClass: "sl-btn-navy",
        eventName: "related_article_click",
        ctaType: "related_article",
      },
    ];
  }

  return [baseComparisonLink];
}

function getAffiliateCopy(articleSlug: string) {
  if (articleSlug.includes("cloudsign")) {
    return {
      title: "クラウドサインの最新料金を確認する",
      description:
        "無料プランの範囲、送信料、有料プランの条件は公式サイトで確認してください。比較記事もあわせて見ると判断しやすくなります。",
    };
  }

  if (articleSlug.includes("smarthr")) {
    if (articleSlug.includes("review")) {
      return {
        title: "SmartHRが自社に合うか確認する",
        description:
          "評判だけで判断せず、必要な機能と運用条件を公式サイトで確認してください。料金の考え方は関連記事で詳しく整理しています。",
      };
    }

    return {
      title: "SmartHRの最新料金を確認する",
      description:
        "公開価格だけでは判断しづらいため、トライアルや見積もり条件を公式サイトで確認してください。比較記事もあわせて見ると判断しやすくなります。",
    };
  }

  if (articleSlug.includes("money-forward")) {
    return {
      title: "マネーフォワード経費の料金を確認する",
      description:
        "プランや連携条件は公式サイトで確認してください。比較記事もあわせて見ると、経費精算フローとの相性を判断しやすくなります。",
    };
  }

  return CTA_BY_TYPE.affiliate;
}

function getQuietArchiveLinks(articleSlug: string, position: string): CtaLink[] {
  return [
    {
      label: "PDF・Webページの変更監視を試す",
      href: buildQuietArchiveUrl("/signup", articleSlug, position, "signup_cta"),
      buttonClass: "sl-btn-teal",
      eventName: "cta_clicked",
    },
    {
      label: "変更検知の仕組みを見る",
      href: buildQuietArchiveUrl("/product-tour", articleSlug, position, "tour_cta"),
      buttonClass: "sl-btn-navy",
      eventName: "cta_clicked",
    },
  ];
}

function getAiConsultLinks(): CtaLink[] {
  return [
    {
      label: "自社の業務フローに合うか相談する",
      href: "https://www.quietarchive.net/contact?utm_source=stacklog&utm_medium=referral&utm_campaign=ai_consult&utm_content=article_contextual_cta",
      buttonClass: "sl-btn-navy",
      eventName: "ai_consult_cta_click",
    },
    {
      label: "業務最適化の記事を見る",
      href: "/pillars/workflow-optimization",
      buttonClass: "sl-btn-teal",
      eventName: "related_article_click",
    },
  ];
}

function resolveCtaType(category: string): CtaType {
  const canonicalCategory = getCanonicalCategorySlug(category);

  if (canonicalCategory === "monitoring-evidence" || canonicalCategory === "quiet-archive-lab") {
    return "quiet_archive";
  }

  if (canonicalCategory === "ai-automation" || canonicalCategory === "workflow-design") {
    return "ai_consult";
  }

  return "affiliate";
}

export default function ArticleCTA({
  articleSlug,
  articleCategory,
  position = "article_bottom",
}: ArticleCTAProps) {
  const ctaType = resolveCtaType(articleCategory);
  const cta = ctaType === "affiliate" ? getAffiliateCopy(articleSlug) : CTA_BY_TYPE[ctaType];
  const links =
    ctaType === "affiliate"
      ? getAffiliateLinks(articleSlug, position)
      : ctaType === "quiet_archive"
        ? getQuietArchiveLinks(articleSlug, position)
        : getAiConsultLinks();

  return (
    <section className="sl-article-cta" aria-label="記事CTA">
      <p className="sl-article-cta-kicker">
        {ctaType === "quiet_archive"
          ? "Monitoring & Evidence"
          : ctaType === "ai_consult"
            ? "AI Automation"
            : "SaaS Comparison"}
      </p>
      <h2>{cta.title}</h2>
      <p>{cta.description}</p>
      <div className="sl-article-cta-actions">
        {links.map((link, index) => (
          <TrackedLink
            key={`${link.href}-${index}`}
            href={link.href}
            className={link.buttonClass}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            eventName={link.eventName}
            params={{
              article_slug: articleSlug,
              article_category: articleCategory,
              cta_type: link.ctaType ?? ctaType,
              cta_label: link.label,
              destination_url: link.href,
              position: `${position}_${index + 1}`,
            }}
          >
            {link.label}
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
