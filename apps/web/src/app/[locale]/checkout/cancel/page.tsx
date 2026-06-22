"use client";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function CheckoutCancelPage() {
  const t = useTranslations();
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="min-h-[80dvh] flex items-center justify-center px-4">
          <div
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/15 flex items-center justify-center mx-auto mb-6 card-hover">
              <XCircle className="w-10 h-10 text-[var(--brand)]" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">{t("checkout.cancelled")}</span>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">{t("checkout.cancelled")}</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">{t("checkout.cancelledDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="md" asChild className="pressable">
                <Link href="/explore">{t("common.back")} <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
  useScrollReveal();
}
