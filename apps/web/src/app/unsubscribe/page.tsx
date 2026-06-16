"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnsubscribePage() {
  const [unsubscribed, setUnsubscribed] = useState(false);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
        className="w-full max-w-sm text-center"
      >
        {!unsubscribed ? (
          <>
            <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
              Se désabonner des emails
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
              Tu ne recevras plus nos notifications par email. Tu pourras toujours
              retrouver les infos sur la plateforme.
            </p>
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-3">
              <p className="text-xs text-[var(--text-tertiary)] mb-2">Email : <strong className="text-[var(--text)]">alex@univibes.com</strong></p>
              <Button variant="primary" size="md" className="w-full" onClick={() => setUnsubscribed(true)}>
                Me désabonner
              </Button>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/">Non, je reste</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
              Tu es désabonné
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
              Tu ne recevras plus nos emails promotionnels. Tu peux toujours te
              réabonner depuis les paramètres de ton compte.
            </p>
            <Button variant="outline" size="md" asChild>
              <Link href="/"><ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil</Link>
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
