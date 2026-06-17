"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailTokenPage() {
  const t = useTranslations();
  const params = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(Math.random() > 0.2 ? "success" : "error");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] px-5">
      {status === "loading" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader className="w-10 h-10 text-[var(--brand)] animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">{t("auth.verifyEmail")}...</p>
        </motion.div>
      )}
      {status === "success" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">{t("auth.verifyEmail")} !</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-8">Ton compte est activé. Tu peux maintenant explorer tous les événements.</p>
          <Button variant="primary" asChild>
            <Link href="/home">{t("home.discoverEvents")} <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </motion.div>
      )}
      {status === "error" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200/50 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">{t("errors.notFound")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-8">Le lien de vérification n&apos;est plus valide. Demande un nouveau lien.</p>
          <Button variant="primary" asChild>
            <Link href="/auth/verify-email">Renvoyer l&apos;email</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
