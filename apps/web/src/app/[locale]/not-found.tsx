import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg)] px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/15 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-[family-name:var(--font-display)] text-[var(--brand)]">404</span>
        </div>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
          Perdu ?
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
          Cette page n&apos;existe pas ou a été déplacée. Pas de panique, on te remet sur le bon chemin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm font-semibold hover:bg-[var(--border-subtle)] transition-colors"
          >
            Explorer les événements
          </Link>
        </div>
      </div>
    </div>
  );
}
