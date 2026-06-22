"use client";

import { useTranslations } from "next-intl";
import { ScrollText } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const TERMS_SECTIONS = [
  { titleKey: "terms1Title", textKey: "terms1Text" },
  { titleKey: "terms2Title", textKey: "terms2Text" },
  { titleKey: "terms3Title", textKey: "terms3Text" },
  { titleKey: "terms4Title", textKey: "terms4Text" },
  { titleKey: "terms5Title", textKey: "terms5Text" },
];

export default function TermsPage() {
  const tl = useTranslations("legal");

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 card-hover">
          <div >
            <div >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4 card-hover">
                <ScrollText className="w-3 h-3 card-hover" />
                {tl("eyebrow.legal")}
              </span>
              <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2 card-hover">{tl("terms")}</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8 card-hover">{tl("updated")}</p>
            </div>

            <div className="prose prose-sm max-w-none space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed card-hover">
              {TERMS_SECTIONS.map((section, i) => (
                <section
                  key={section.titleKey} className="reveal card-hover">
                  <h2 className="text-lg font-semibold text-[var(--text)] mb-3 card-hover">{tl(section.titleKey)}</h2>
                  <p>{tl(section.textKey)}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
