"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Search, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAYOUTS = [
  { id: "1", organizer: "Club Culturel UAC", amount: "45 000 FCFA", date: "12 juin 2025", status: "pending" as const },
  { id: "2", organizer: "BDE FASEG", amount: "28 000 FCFA", date: "10 juin 2025", status: "approved" as const },
  { id: "3", organizer: "TECH HUB UAC", amount: "12 500 FCFA", date: "8 juin 2025", status: "paid" as const },
  { id: "4", organizer: "Club IA UAC", amount: "67 000 FCFA", date: "5 juin 2025", status: "pending" as const },
];

export default function AdminPayoutsPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("admin.payouts")}</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{t("admin.payoutsDesc")}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input type="text" placeholder={t("admin.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30" />
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {PAYOUTS.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{p.organizer}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{p.date} · {p.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={p.status === "paid" ? "success" : p.status === "approved" ? "soft" : "warning"}>
                    {p.status === "paid" ? t("admin.paid") : p.status === "approved" ? t("admin.approved") : t("admin.pendingPayout")}
                  </Badge>
                  {p.status === "pending" && (
                    <div className="flex gap-1">
                      <button className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100"><Check className="w-3.5 h-3.5" /></button>
                      <button className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
