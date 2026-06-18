import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import GlobalClickTracking from "@/components/GlobalClickTracking";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stacklogs.net"),
  title: {
    default: "Stacklogs | Workflow Intelligence Media",
    template: "%s | Stacklog",
  },
  description:
    "業務フローを、SaaS・AI・自動化・変更監視で最適化するWorkflow Intelligence Media。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://stacklogs.net",
    siteName: "Stacklog",
    title: "Stacklogs | Workflow Intelligence Media",
    description:
      "会計・契約・人事労務・AI活用・PDF監視・Web変更検知まで、業務フローの改善に必要なツールと運用設計を整理するメディア。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stacklogs | Workflow Intelligence Media",
    description:
      "SaaS比較、AI自動化、変更監視、証跡管理を扱うWorkflow Intelligence Media。",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "q6gvwtaEatHGaolzW7u-2CXh3PgnmEZqMu-ZWFn6qKw",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stacklogs",
    url: "https://stacklogs.net",
    description:
      "Workflow Intelligence Media for SaaS comparison, AI automation, monitoring, evidence management, and workflow optimization.",
    publisher: {
      "@type": "Organization",
      name: "Stacklogs",
      url: "https://stacklogs.net",
    },
    about: [
      "PDF monitoring",
      "document change detection",
      "compliance workflow",
      "vendor procurement workflow",
      "AI workflow",
    ],
  };

  return (
    <html lang="ja">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R38Z29TL4G" />
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R38Z29TL4G');
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable} ${jetbrainsMono.variable} antialiased`}>
        <GlobalClickTracking />
        {/* Header */}
        <header
          className="sticky top-0 z-50"
          style={{
            height: 62,
            background: '#fff',
            borderBottom: '1px solid var(--gray200)',
            boxShadow: 'var(--sh1)',
          }}
        >
          <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0 hover:opacity-80 transition-opacity">
              <span
                className="font-semibold text-base tracking-tight"
                style={{ color: 'var(--navy)', fontFamily: 'var(--font-inter)' }}
              >
                Stack
              </span>
              <span
                className="font-medium text-base"
                style={{ color: 'var(--teal)', fontFamily: 'var(--font-jetbrains)' }}
              >
                log
              </span>
            </Link>

            {/* Nav */}
            <nav className="site-nav">
              <Link href="/posts" className="nav-link">
                記事一覧
              </Link>
              <Link href="/pillars" className="nav-link">
                ピラー
              </Link>
              <Link href="/posts?category=back-office" className="nav-link">
                Back Office
              </Link>
              <Link href="/posts?category=ai-automation" className="nav-link">
                AI Automation
              </Link>
              <Link href="/posts?category=monitoring-evidence" className="nav-link">
                Monitoring
              </Link>
              <Link
                href="https://www.quietarchive.net/signup?utm_source=stacklogs&utm_medium=referral&utm_campaign=quiet_archive_pr&utm_content=site_header_quiet_archive_signup&utm_term=website_monitoring"
                target="_blank"
                rel="noopener noreferrer"
                className="sl-btn-teal"
                data-cta="site_header_quiet_archive"
              >
                PDF変更を監視
              </Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main>{children}</main>

        {/* Footer */}
        <footer style={{ background: 'var(--navy)', marginTop: 80 }}>
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div>
                <div className="flex items-center mb-3">
                  <span
                className="font-semibold text-base"
                    style={{ color: '#fff', fontFamily: 'var(--font-inter)' }}
                  >
                    Stack
                  </span>
                  <span
                    className="font-medium text-base"
                    style={{ color: 'var(--teal)', fontFamily: 'var(--font-jetbrains)' }}
                  >
                    log
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  SaaS比較、AI自動化、変更監視、証跡管理、Compliance Workflowを扱うWorkflow Intelligence Media。
                </p>
              </div>

              {/* カテゴリ */}
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  カテゴリ
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/posts?category=workflow-design" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      Workflow Design
                    </Link>
                  </li>
                  <li>
                    <Link href="/posts?category=back-office" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      Back Office
                    </Link>
                  </li>
                  <li>
                    <Link href="/posts?category=ai-automation" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      AI Automation
                    </Link>
                  </li>
                  <li>
                    <Link href="/posts?category=monitoring-evidence" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      Monitoring & Evidence
                    </Link>
                  </li>
                </ul>
              </div>

              {/* リンク */}
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  リンク
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      このサイトについて
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      プライバシーポリシー
                    </Link>
                  </li>
                  <li>
                    <Link href="/policy" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      免責事項
                    </Link>
                  </li>
                </ul>
              </div>

              {/* プロダクト */}
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  プロダクト
                </p>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://www.quietarchive.net/signup?utm_source=stacklogs&utm_medium=referral&utm_campaign=quiet_archive_pr&utm_content=site_footer_quiet_archive_signup&utm_term=website_monitoring"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:text-white transition-colors"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                      data-cta="site_footer_quiet_archive"
                    >
                      Quiet ArchiveでPDF変更を監視
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              className="flex items-center justify-between pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                © 2026 Stacklog
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-jetbrains)' }}>
                Built by Yoshi
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
