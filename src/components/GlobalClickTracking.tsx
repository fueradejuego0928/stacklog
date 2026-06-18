"use client";

import { useEffect } from "react";

const EVENT_BY_CTA_KEYWORD: Array<[string, string, string]> = [
  ["quiet_archive", "cta_clicked", "quiet_archive"],
  ["affiliate", "affiliate_cta_click", "affiliate"],
  ["ai_consult", "ai_consult_cta_click", "ai_consult"],
  ["template", "template_download_click", "template"],
  ["pricing", "pricing_article_cta_click", "affiliate"],
  ["comparison", "comparison_table_click", "affiliate"],
  ["related", "related_article_click", "related_article"],
  ["pillar", "pillar_page_view", "related_article"],
];

function resolveEvent(ctaKey: string) {
  return (
    EVENT_BY_CTA_KEYWORD.find(([keyword]) => ctaKey.includes(keyword)) ?? [
      "",
      "affiliate_cta_click",
      "affiliate",
    ]
  );
}

export default function GlobalClickTracking() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[data-cta]") as HTMLAnchorElement | null;
      if (!link) return;

      const ctaKey = link.dataset.cta ?? "";
      const [, eventName, ctaType] = resolveEvent(ctaKey);
      const params = {
        article_slug: link.dataset.articleSlug ?? "",
        article_category: link.dataset.articleCategory ?? "",
        cta_type: link.dataset.ctaType ?? ctaType,
        cta_label: link.dataset.ctaLabel ?? link.textContent?.trim() ?? ctaKey,
        destination_url: link.href,
        position: link.dataset.position ?? ctaKey,
      };

      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
        return;
      }

      window.dataLayer?.push(["event", eventName, params]);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
