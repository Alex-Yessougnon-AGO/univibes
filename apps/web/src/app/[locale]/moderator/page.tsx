"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Shield, Check, X, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PENDING = [
  { name: "Hackathon IA & Data", org: "Club IA UAC", date: "15 juil.", status: "pending" },
  { name: "Soirée d'intégration EPS", org: "BDE EPS", date: "20 juil.", status: "pending" },
  { name: "Conférence : Marketing Digital", org: "Junior Entreprise", date: "22 juil.", status: "pending" },
];

export default function ModeratorDashboardPage() {
  const t = useTranslations();
  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--brand)] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm text-[var(--text)]">{t("moderator.title")}</span>
          </div>
          <Badge variant="warning" className="text-[10px]">{PENDING.length} {t("moderator.pendingEvents").toLowerCase()}</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("moderator.pendingEvents")}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{PENDING.length} {t("moderator.pendingEvents").toLowerCase()}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)]">
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-xs font-semibold text-[var(--text)]">{t("admin.pendingApproval")}</span>
              </div>
            </div>
            {PENDING.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{item.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{item.org} · {item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors"><Check className="w-4 h-4" /></button>
                  <button className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"><X className="w-4 h-4" /></button>
                  <Button variant="ghost" size="sm" asChild><Link href={`/moderator/events/${item.name.toLowerCase().replace(/\s+/g, "-")}/review`}>{t("common.seeAll")}</Link></Button>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
