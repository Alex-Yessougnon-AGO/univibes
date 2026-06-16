"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      <header className="z-10 h-16 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center shadow-[var(--shadow-brand)]">
            <span className="text-white font-black text-sm">UV</span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--text)]">Univibes</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-5 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-amber-500" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 text-[11px] font-semibold text-amber-600 tracking-wide mb-4">
            <Sparkles className="w-3 h-3" />
            Vérifie ton email
          </span>
          <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">Un dernier effort !</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-2 leading-relaxed">
            On t&apos;a envoyé un email de confirmation à <strong className="text-[var(--text)]">ton@email.com</strong>.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mb-8">Clique sur le lien dans l&apos;email pour activer ton compte. Tu peux fermer cette page.</p>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-3 mb-6">
            <p className="text-xs text-[var(--text-secondary)]">Tu n&apos;as rien reçu ?</p>
            <Button variant="outline" size="sm" className="w-full">Renvoyer l&apos;email</Button>
            <Button variant="ghost" size="sm" className="w-full text-[var(--text-tertiary)]" asChild>
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
