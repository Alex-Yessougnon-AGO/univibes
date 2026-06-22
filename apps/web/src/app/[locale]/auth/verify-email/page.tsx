"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Mail, ArrowRight, Sparkles, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useAuth } from "@/lib/auth-context";
import { authService } from "@/lib/services/auth-service";

export default function VerifyEmailPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  useScrollReveal();

  const handleResend = async () => {
    setSending(true);
    try {
      await authService.resendVerification();
      setSent(true);
    } catch {}
    setSending(false);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      <header className="z-10 h-16 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center shadow-[var(--shadow-brand)] card-hover">
            <span className="text-white font-black text-sm">UV</span>
          
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--text)]">{t("common.appName")}</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-5 pb-12">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/15 flex items-center justify-center mx-auto mb-6 card-hover">
            <Mail className="w-10 h-10 text-[var(--brand)]" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
            <Sparkles className="w-3 h-3" />
            {t("auth.verifyEmail")}
          </span>
          <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">{t("auth.checkEmail")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-2 leading-relaxed">
            {t("auth.emailSent", { email: "ton@email.com" })}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mb-8">Clique sur le lien dans l&apos;email pour activer ton compte. Tu peux fermer cette page.</p>
  useScrollReveal();

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-3 mb-6 card-hover">
            <p className="text-xs text-[var(--text-secondary)]">Tu n&apos;as rien reçu ?</p>
            <Button variant="outline" size="sm" className="w-full pressable">Renvoyer l&apos;email</Button>
            <Button variant="ghost" size="sm" className="w-full text-[var(--text-tertiary)] pressable" asChild>
              <Link href="/login">{t("nav.login")}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
