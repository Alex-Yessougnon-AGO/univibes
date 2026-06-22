"use client";

import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const COOKIES_SECTIONS = [
  { titleKey: "cookies1Title", textKey: "cookies1Text" },
  { titleKey: "cookies2Title", textKey: "cookies2Text" },
  { titleKey: "cookies3Title", textKey: "cookies3Text" },
];

export default function CookiesPage() {
  const tl = useTranslations("legal");

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 card-hover">
          <div >
            <div >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4 card-hover">
                <Cookie className="w-3 h-3 card-hover" />
                {tl("eyebrow.cookies")}
              </span>
              <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2 card-hover">{tl("cookies")}</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8 card-hover">{tl("updated")}</p>
            </div>

            <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed card-hover">
              {COOKIES_SECTIONS.map((section, i) => (
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
