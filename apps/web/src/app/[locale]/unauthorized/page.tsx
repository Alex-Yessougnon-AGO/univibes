"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const t = useTranslations();
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] px-5">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200/50 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">Accès refusé</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">Tu n&apos;as pas les permissions nécessaires pour accéder à cette page.</p>
        <Button variant="primary" asChild><Link href="/"><ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil</Link></Button>
      </motion.div>
    </div>
  );
}
