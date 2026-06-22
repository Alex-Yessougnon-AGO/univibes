"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Sparkles, Check, ArrowRight, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function PricingPage() {
  const t = useTranslations();
  const [annual, setAnnual] = useState(false);
  useScrollReveal();
  
  const PLANS = [
    {
      name: "Gratuit",
      price: "0",
      period: t("pricing.always"),
      desc: t("pricing.starterDesc"),
      features: [
        t("pricing.feature.unlimitedEvents"),
        t("pricing.feature.max100"),
        t("pricing.feature.basicStats"),
        t("pricing.feature.verifiedBadge"),
        t("pricing.feature.emailSupport"),
      ],
      cta: "free",
      popular: false,
    },
    {
      name: "Premium",
      price: "10 000",
      period: "/ mois",
      desc: t("pricing.proDesc"),
      features: [
        t("pricing.feature.allFree"),
        t("pricing.feature.unlimitedParticipants"),
        t("pricing.feature.advancedStats"),
        t("pricing.feature.boosts"),
        t("pricing.feature.paidTicketing"),
        t("pricing.feature.csvExport"),
        t("pricing.feature.prioritySupport"),
        t("pricing.feature.premiumBadge"),
      ],
      cta: "pro",
      popular: true,
    },
    {
      name: "Sponsor",
      price: t("pricing.customPrice"),
      period: "",
      desc: t("pricing.enterpriseDesc"),
      features: [
        t("pricing.feature.homeVisibility"),
        t("pricing.feature.banners"),
        t("pricing.feature.targeting"),
        t("pricing.feature.monthlyReport"),
        t("pricing.feature.apiAccess"),
        t("pricing.feature.dedicatedSupport"),
        t("pricing.feature.customInvoice"),
      ],
      cta: "contact",
      popular: false,
    },
  ];
  
  const FAQ = [
    { q: t("pricing.faq1q"), a: t("pricing.faq1a") },
    { q: t("pricing.faq2q"), a: t("pricing.faq2a") },
    { q: t("pricing.faq3q"), a: t("pricing.faq3a") },
    { q: t("pricing.faq4q"), a: t("pricing.faq4a") },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-20 pb-12 overflow-hidden reveal">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div >
              <span  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-6">
                <Sparkles className="w-3 h-3" />
                {t("pricing.title")}
              </span>
              <h1  className="text-4xl sm:text-5xl font-[family-name:var(--font-display)] text-[var(--text)] leading-tight tracking-tight mb-4">
                {t("pricing.title")}
              </h1>
              <p  className="text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
                {t("pricing.subtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 reveal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl p-6 border shadow-[var(--shadow)] flex flex-col",
                  plan.popular
                    ? "bg-[var(--surface)] border-[var(--brand)]/30 ring-1 ring-[var(--brand)]/20"
                    : "bg-[var(--surface)] border-[var(--border)]"
                )}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--brand-hover)] text-white text-[10px] font-bold uppercase tracking-wider shadow-[var(--shadow-brand)]">
                    {t("pricing.mostPopular")}
                  </span>
                )}

                <div className="mb-6">
                  <h2 className="font-semibold text-lg text-[var(--text)]">{plan.name === "Gratuit" ? t("pricing.free") : plan.name === "Premium" ? t("pricing.pro") : plan.name === "Sponsor" ? t("pricing.enterprise") : plan.name}</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{plan.name === "Gratuit" ? t("pricing.starterDesc") : plan.name === "Premium" ? t("pricing.proDesc") : plan.name === "Sponsor" ? t("pricing.enterpriseDesc") : plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-[var(--text)] font-[family-name:var(--font-display)]">{plan.price}</span>
                  {plan.period && <span className="text-sm text-[var(--text-secondary)] ml-1">{plan.period === "/ mois" ? t("pricing.month") : plan.period}</span>}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                      <Check className="w-4 h-4 text-[var(--brand)] shrink-0 mt-px" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  size="md"
                  className="w-full pressable"
                  asChild
                >
                  <Link href={plan.name === "Sponsor" ? "/contact" : "/register?role=organizer"}>
                    {plan.cta === "contact" ? t("pricing.ctaContact") : t("pricing.cta")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[var(--border-subtle)]/50 reveal">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] text-center mb-8">{t("pricing.faq")}</h2>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-medium text-[var(--text)] hover:bg-[var(--border-subtle)] transition-colors [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] group-open:rotate-90 transition-transform shrink-0 ml-2" />
                  </summary>
                  <div className="px-5 pb-5 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
