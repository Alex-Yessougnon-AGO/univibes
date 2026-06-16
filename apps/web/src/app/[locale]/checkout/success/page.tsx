"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="min-h-[80dvh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-sm)]">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 text-[11px] font-semibold text-emerald-600 tracking-wide mb-4">
              <Sparkles className="w-3 h-3" />
              Paiement confirmé
            </span>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-2">
              Réservation confirmée !
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
              Ton billet a été réservé avec succès. Tu vas recevoir un email de confirmation avec ton QR code. Présente-le à l&apos;entrée le jour J.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="md" asChild>
                <Link href="/tickets">Voir mes billets <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button variant="outline" size="md" asChild>
                <Link href="/explore">Explorer d&apos;autres événements</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
