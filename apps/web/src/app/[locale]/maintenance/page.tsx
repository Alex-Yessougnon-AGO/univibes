"use client";

import { useTranslations } from "next-intl";
import { Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function MaintenancePage() {
  const t = useTranslations();
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] px-5">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/15 flex items-center justify-center mx-auto mb-6 card-hover">
          <Wrench className="w-10 h-10 text-[var(--brand)]" />
        </div>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">En maintenance</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">On apporte les dernières retouches. Reviens dans quelques minutes !</p>
        <Button variant="outline" disabled className="pressable"><ArrowLeft className="w-4 h-4" /> Réessayer</Button>
      </div>
    </div>
  );
  useScrollReveal();
}
