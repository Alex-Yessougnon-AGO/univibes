"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { CreditCard, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAYMENTS = [
  { id: "PAY-001", user: "Koffi A.", event: "Gala FASEG", amount: "15 000 FCFA", method: "FedaPay", status: "Réussi", date: "15 Juin 2025" },
  { id: "PAY-002", user: "Sarah B.", event: "HackBénin", amount: "0 FCFA", method: "Gratuit", status: "Réussi", date: "14 Juin 2025" },
  { id: "PAY-003", user: "Jean K.", event: "AfroBeats Night", amount: "50 000 FCFA", method: "Kkiapay", status: "En attente", date: "13 Juin 2025" },
  { id: "PAY-004", user: "Mariam D.", event: "Speed Networking", amount: "3 000 FCFA", method: "FedaPay", status: "Réussi", date: "12 Juin 2025" },
  { id: "PAY-005", user: "Paul H.", event: "Nuit des Arts", amount: "8 000 FCFA", method: "Kkiapay", status: "Échoué", date: "10 Juin 2025" },
];

const statusVariant = (s: string) => {
  if (s === "Réussi") return "success" as const;
  if (s === "En attente") return "warning" as const;
  return "error" as const;
};

export default function AdminPaymentsPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">{t("admin.payments")}</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{t("admin.paymentsManagementDesc")}</p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: t("admin.totalTransactions"), value: "12.4M FCFA" },
          { label: t("admin.successful"), value: "11.2M FCFA" },
          { label: t("admin.pendingTransactions"), value: "1.2M FCFA" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 shadow-[var(--shadow-sm)]">
            <p className="text-xl font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">{s.value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)]">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder={t("admin.searchPayments")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/50">
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t("admin.tableId")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t("admin.tableClient")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">{t("admin.tableEvent")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">{t("admin.tableAmount")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">{t("admin.tableMethod")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t("admin.tableStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {PAYMENTS.filter((p) => p.id.toLowerCase().includes(search.toLowerCase()) || p.user.toLowerCase().includes(search.toLowerCase())).map((pmt) => (
                <tr key={pmt.id} className="hover:bg-[var(--border-subtle)]/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-mono font-medium text-[var(--text)]">{pmt.id}</td>
                  <td className="px-4 py-3.5 text-sm text-[var(--text)]">{pmt.user}</td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-sm text-[var(--text-secondary)]">{pmt.event}</td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-sm font-medium text-[var(--brand)]">{pmt.amount}</td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-[var(--text-secondary)]">{pmt.method}</td>
                  <td className="px-4 py-3.5"><Badge variant={statusVariant(pmt.status)}>{pmt.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
