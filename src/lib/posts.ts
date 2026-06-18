import { allPosts, Post } from "contentlayer/generated";
import { getCanonicalCategorySlug } from "./categories";

const CATEGORY_CLUSTER_ALIASES: Record<string, string[]> = {
  "workflow-design": ["workflow-automation"],
  "back-office": ["accounting", "hr-labor", "e-signature-document-management"],
  "ai-automation": ["ai-workflow", "workflow-automation", "ai-saas"],
  "monitoring-evidence": [
    "pdf-document-monitoring",
    "monitoring-change-detection",
    "compliance-audit",
    "vendor-procurement-workflow",
    "web-operations",
  ],
  "saas-comparison": ["crm-ma", "accounting", "hr-labor", "e-signature-document-management"],
  "quiet-archive-lab": [
    "pdf-document-monitoring",
    "monitoring-change-detection",
    "compliance-audit",
    "vendor-procurement-workflow",
  ],
  "compliance-audit": ["pdf-document-monitoring", "monitoring-change-detection"],
  "vendor-procurement-workflow": ["monitoring-change-detection"],
  "web-operations": ["monitoring-change-detection"],
  "e-signature-document-management": ["pdf-document-monitoring"],
};

const RELATED_POST_SLUGS: Record<string, string[]> = {
  "back-office/cloudsign-pricing-plan": [],
  "back-office/smarthr-pricing-plan": [
    "back-office/smarthr-review-reputation",
  ],
  "back-office/smarthr-review-reputation": [
    "back-office/smarthr-pricing-plan",
  ],
  "back-office/money-forward-expense-workflow": [
    "back-office/bakuraku-vs-bill-one",
  ],
  "back-office/bakuraku-vs-bill-one": [
    "back-office/money-forward-expense-workflow",
  ],
};

export function getAllPosts(): Post[] {
  return allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  const categories = new Set([category, ...(CATEGORY_CLUSTER_ALIASES[category] ?? [])]);
  return getAllPosts().filter(
    (post) =>
      categories.has(post.category) ||
      categories.has(getCanonicalCategorySlug(post.category)),
  );
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  if (Object.hasOwn(RELATED_POST_SLUGS, post.slug)) {
    return RELATED_POST_SLUGS[post.slug]
      .map((slug) => getPostBySlug(slug))
      .filter((candidate): candidate is Post => Boolean(candidate))
      .slice(0, limit);
  }

  return getAllPosts()
    .filter(
      (candidate) =>
        getCanonicalCategorySlug(candidate.category) === getCanonicalCategorySlug(post.category) &&
        candidate.slug !== post.slug,
    )
    .slice(0, limit);
}
