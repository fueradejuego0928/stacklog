import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  turbopack: {},
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/smarthr-ryokin-plan/",
        destination: "/posts/back-office/smarthr-pricing-plan",
        statusCode: 301,
      },
      {
        source: "/smarthr-review-2025/",
        destination: "/posts/back-office/smarthr-review-reputation",
        statusCode: 301,
      },
      {
        source: "/cloudsign-ryokin-plan/",
        destination: "/posts/back-office/cloudsign-pricing-plan",
        statusCode: 301,
      },
      {
        source: "/cloudsign-vs-gmosign/",
        destination: "/posts/back-office/cloudsign-pricing-plan",
        statusCode: 301,
      },
      {
        source: "/google-apps-script-beginner/",
        destination: "/posts/ai-automation/google-apps-script-business-automation",
        statusCode: 301,
      },
      {
        source: "/moneyforward-expense-howto/",
        destination: "/posts/back-office/money-forward-expense-workflow",
        statusCode: 301,
      },
      {
        source: "/bakuraku-vs-billone/",
        destination: "/posts/back-office/bakuraku-vs-bill-one",
        statusCode: 301,
      },
      {
        source: "/ai-image-generation-tools-ranking/",
        destination: "/posts/ai-saas/ai-image-generation-tools-recommended",
        statusCode: 301,
      },
      {
        source: "/website-change-detection-tools-comparison/",
        destination: "/posts/ai-saas/website-change-detection-tools-comparison",
        statusCode: 301,
      },
      {
        source: "/dify-how-to-japanese/",
        destination: "/posts/ai-saas/dify-how-to-use-japanese",
        statusCode: 301,
      },
      {
        source: "/electronic-contract-ranking/",
        destination: "/pillars/e-signature-workflow",
        statusCode: 301,
      },
      {
        source: "/smarthr-vs-freee-hr/",
        destination: "/posts/back-office/smarthr-pricing-plan",
        statusCode: 301,
      },
      {
        source: "/smarthr-free-trial/",
        destination: "/posts/back-office/smarthr-pricing-plan",
        statusCode: 301,
      },
    ];
  },
};

export default withContentlayer(nextConfig);
