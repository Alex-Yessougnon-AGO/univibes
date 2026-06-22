"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/lib/services/organizer-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const statusVariant = (s: string) => {
  if (s === "completed" || s === "Réussi" || s === "success") return "success" as const;
  if (s === "pending" || s === "En attente") return "warning" as const;
  return "error" as const;
};

export default function AdminPaymentsPage() {
  const t = useTranslations();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useScrollReveal();

  useEffect(() => {
    adminService
      .getTransactions()
      .then((data: any) => setPayments(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(
    (p: any) =>
      (p.id ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.user?.name ?? p.user?.email ?? p.user ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalAmount = payments.reduce(
    (sum: number, p: any) => sum + (Number(p.amount) || 0),
    0
  );
  const successfulAmount = payments
    .filter((p: any) => p.status === "completed" || p.status === "Réussi")
    .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
          {t("admin.payments")}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {t("admin.paymentsManagementDesc")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: t("admin.totalTransactions"),
            value: `${totalAmount.toLocaleString()} FCFA`,
          },
          {
            label: t("admin.successful"),
            value: `${successfulAmount.toLocaleString()} FCFA`,
          },
          {
            label: t("admin.pendingTransactions"),
            value: `${(totalAmount - successfulAmount).toLocaleString()} FCFA`,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 shadow-[var(--shadow-sm)] card-hover"
          >
            <p className="text-xl font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">
              {s.value}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)] card-hover">
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
        {loading ? (
          <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
            Chargement...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/50">
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {t("admin.tableId")}
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {t("admin.tableClient")}
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">
                    {t("admin.tableEvent")}
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">
                    {t("admin.tableAmount")}
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">
                    {t("admin.tableMethod")}
                  </th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {t("admin.tableStatus")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((pmt: any) => (
                  <tr
                    key={pmt.id}
                    className="hover:bg-[var(--border-subtle)]/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-sm font-mono font-medium text-[var(--text)]">
                      {pmt.id?.slice(0, 8) ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text)]">
                      {pmt.user?.name ?? pmt.user?.email ?? pmt.user ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-sm text-[var(--text-secondary)]">
                      {pmt.event?.title ?? pmt.event ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell text-sm font-medium text-[var(--brand)]">
                      {pmt.amount
                        ? `${Number(pmt.amount).toLocaleString()} FCFA`
                        : "—"}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-[var(--text-secondary)]">
                      {pmt.method ?? pmt.paymentMethod ?? "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariant(pmt.status)}>
                        {pmt.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
