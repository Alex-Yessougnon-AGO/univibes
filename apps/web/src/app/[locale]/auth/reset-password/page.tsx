"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Lock, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const t = useTranslations();
  const [step, setStep] = useState<"request" | "sent">("request");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("sent");
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      <div className="absolute top-0 left-0 right-0 h-[35dvh] bg-gradient-to-b from-[var(--brand)]/8 to-transparent pointer-events-none" />
      <header className="relative z-10 h-16 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center shadow-[var(--shadow-brand)] transition-transform group-hover:scale-105">
            <span className="text-white font-black text-sm">UV</span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--text)]">{t("common.appName")}</span>
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <motion.div variants={fadeUp} className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/15 flex items-center justify-center mx-auto mb-4">
              {step === "sent" ? <Check className="w-7 h-7 text-emerald-500" /> : <Lock className="w-7 h-7 text-[var(--brand)]" />}
            </div>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">
              {step === "sent" ? t("auth.checkEmail") : t("auth.forgotPassword")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-64 mx-auto">
              {step === "sent" ? "Si ce compte existe, tu recevras un lien de réinitialisation sous quelques minutes." : t("auth.resetPassword")}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
            {step === "request" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label={t("auth.email")} type="email" placeholder="ton@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button variant="primary" size="lg" className="w-full" type="submit">
                  {t("auth.sendResetLink")} <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)] mb-3">Email : <strong className="text-[var(--text)]">{email}</strong></p>
                <Button variant="outline" size="sm" onClick={() => setStep("request")}>Renvoyer l&apos;email</Button>
              </div>
            )}
          </motion.div>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-[var(--brand)] font-medium hover:text-[var(--brand-hover)] transition-colors">{t("nav.login")}</Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
