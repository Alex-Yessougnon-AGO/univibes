"use client";

import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const PRIVACY_SECTIONS = [
  { titleKey: "privacy1Title", textKey: "privacy1Text" },
  { titleKey: "privacy2Title", textKey: "privacy2Text" },
  { titleKey: "privacy3Title", textKey: "privacy3Text" },
  { titleKey: "privacy4Title", textKey: "privacy4Text" },
];

export default function PrivacyPage() {
  const tl = useTranslations("legal");

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 card-hover">
          <div >
            <div >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4 card-hover">
                <Shield className="w-3 h-3 card-hover" />
                {tl("eyebrow.privacy")}
              </span>
              <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2 card-hover">{tl("privacy")}</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8 card-hover">{tl("updated")}</p>
            </div>

            <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed card-hover">
              {PRIVACY_SECTIONS.map((section, i) => (
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
