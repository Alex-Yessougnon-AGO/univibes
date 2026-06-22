"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Mail, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function UnsubscribePage() {
  const t = useTranslations();
  const [unsubscribed, setUnsubscribed] = useState(false);
  useScrollReveal();

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] px-5">
      <div
        className="w-full max-w-sm text-center"
      >
        {!unsubscribed ? (
          <>
            <div className="w-20 h-20 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/15 flex items-center justify-center mx-auto mb-6 card-hover">
              <Mail className="w-10 h-10 text-[var(--brand)]" />
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
              Se désabonner des emails
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
              Tu ne recevras plus nos notifications par email. Tu pourras toujours
              retrouver les infos sur la plateforme.
            </p>
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-3 card-hover">
              <p className="text-xs text-[var(--text-tertiary)] mb-2">Email : <strong className="text-[var(--text)]">alex@univibes.com</strong></p>
              <Button variant="primary" size="md" className="w-full pressable" onClick={() => setUnsubscribed(true)}>
                Me désabonner
              </Button>
              <Button variant="ghost" size="sm" className="w-full pressable" asChild>
                <Link href="/">Non, je reste</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent)]/15 flex items-center justify-center mx-auto mb-6 card-hover">
              <Check className="w-10 h-10 text-[var(--accent)]" />
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
              Tu es désabonné
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
              Tu ne recevras plus nos emails promotionnels. Tu peux toujours te
              réabonner depuis les paramètres de ton compte.
            </p>
            <Button variant="outline" size="md" asChild className="pressable">
              <Link href="/"><ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
