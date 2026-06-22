"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, ArrowRight, Check, XCircle, Sparkles, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth-service";

export default function ResetPasswordPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"form" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await authService.resetPassword(token, newPassword);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Le lien de réinitialisation est invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
        <div className="absolute top-0 left-0 right-0 h-[35dvh] bg-gradient-to-b from-emerald-500/8 to-transparent pointer-events-none" />
        <header className="relative z-10 h-16 flex items-center px-5">
          <Link href="/login" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            {t("common.back")}
          </Link>
        </header>
        <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-sm)] card-hover">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("auth.resetPassword")}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-xs mx-auto">Mot de passe réinitialisé avec succès ! Tu peux maintenant te connecter.</p>
            <div className="mt-8">
              <Button variant="primary" size="md" asChild className="pressable">
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/15 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-[var(--brand)]" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-xs font-semibold text-[var(--brand-text)] tracking-wide mb-4">
              <Sparkles className="w-3 h-3" />
              {t("auth.resetPassword")}
            </span>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">
              Nouveau mot de passe
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-64 mx-auto">
              Choisis un nouveau mot de passe pour ton compte.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!token && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">Lien invalide</p>
                    <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-0.5">Le lien de réinitialisation est manquant ou invalide. Demande un nouveau lien.</p>
                  </div>
                </div>
              )}
              {errorMsg && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                </div>
              )}
              <Input
                label="Nouveau mot de passe"
                type="password"
                placeholder="Min. 8 caractères"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={!token}
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="Retaper le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!token}
              />
              <p className="text-xs text-[var(--text-tertiary)]">Minimum 8 caractères, dont une majuscule et un chiffre.</p>
              <Button
                variant="primary"
                size="lg"
                className="w-full pressable"
                type="submit"
                disabled={loading || !token}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("common.sending")}
                  </span>
                ) : (
                  <>{t("auth.resetPassword")} <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-[var(--brand)] font-medium hover:text-[var(--brand-hover)] transition-colors">{t("nav.login")}</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
