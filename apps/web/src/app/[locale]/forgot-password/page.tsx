"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { ArrowLeft, Mail, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
        <div className="absolute top-0 left-0 right-0 h-[35dvh] bg-gradient-to-b from-emerald-500/8 to-transparent pointer-events-none" />

        <header className="relative z-10 h-16 flex items-center px-5">
          <Link href="/login" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Retour
          </Link>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            className="w-full max-w-sm text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-sm)]">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">Email envoyé !</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-xs mx-auto">
              Si un compte existe avec l&apos;adresse <strong className="text-[var(--text)]">{email}</strong>,
              tu recevras un lien de réinitialisation sous quelques minutes.
            </p>
            <div className="mt-8">
              <Button variant="outline" size="md" asChild>
                <Link href="/login">Retour à la connexion</Link>
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      <div className="absolute top-0 left-0 right-0 h-[35dvh] bg-gradient-to-b from-[var(--brand)]/8 to-transparent pointer-events-none" />

      <header className="relative z-10 h-16 flex items-center px-5">
        <Link href="/login" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Retour
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
          className="w-full max-w-sm"
        >
          {/* Eyebrow */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-xs font-semibold text-[var(--brand-text)] tracking-wide">
              <Sparkles className="w-3 h-3" />
              Aide à la connexion
            </span>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-brand)]">
            <Mail className="w-7 h-7 text-white" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
              Mot de passe oublié
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-64 mx-auto leading-relaxed">
              Entre ton email et on t&apos;envoie un lien de réinitialisation
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi…
                  </span>
                ) : (
                  "Envoyer le lien"
                )}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Tu te souviens de ton mot de passe ?{" "}
              <Link
                href="/login"
                className="text-[var(--brand)] font-semibold hover:text-[var(--brand-hover)] transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
