import Link from "next/link";
import { getCategoryMeta } from "@/lib/categories";
import { PILLAR_PAGES } from "@/lib/pillars";

export const metadata = {
  title: "ピラーページ一覧",
  description:
    "業務ワークフロー最適化、Back Office、AI Automation、Monitoring & Evidence、Compliance Workflowのピラーページ一覧。",
};

export default function PillarsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="section-kicker">Pillar Pages</p>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
          業務フロー最適化のピラーページ
        </h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--gray400)' }}>
          SaaS比較、Back Office、AI自動化、変更監視、証跡管理をカテゴリ単位で整理した入口です。
        </p>
      </header>

      <div className="post-grid">
        {PILLAR_PAGES.map((page) => (
          <Link
            key={page.slug}
            href={`/pillars/${page.slug}`}
            className="block rounded-lg p-5 transition-colors hover:bg-[var(--snow)]"
            style={{ background: '#fff', border: '1px solid var(--gray200)' }}
          >
            <span className="category-badge mb-3 inline-block">
              {getCategoryMeta(page.categorySlug).label}
            </span>
            <h2 className="text-base font-bold leading-snug mb-2" style={{ color: 'var(--navy)' }}>
              {page.title}
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--gray400)' }}>
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
