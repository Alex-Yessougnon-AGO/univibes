"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/lib/services/organizer-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminPayoutsPage() {
  const t = useTranslations();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useScrollReveal();

  useEffect(() => {
    adminService
      .getTransactions()
      .then((data: any) => setPayouts(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = payouts.filter(
    (p: any) =>
      (p.organizer?.name ?? p.organizer ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">
              {t("admin.payouts")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {t("admin.payoutsDesc")}
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder={t("admin.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
            />
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden card-hover">
            {loading ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                Chargement...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                {t("common.noResults")}
              </div>
            ) : (
              filtered.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">
                      {p.organizer?.name ??
                       p.organizer?.organizationName ??
                       p.event?.organizer?.organizationName ??
                       p.user?.name ??
                       "—"}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "—"}{" "}
                      · {p.amount ? `${Number(p.amount).toLocaleString()} FCFA` : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        p.status === "paid" || p.status === "completed"
                          ? "success"
                          : p.status === "approved"
                          ? "soft"
                          : "warning"
                      }
                    >
                      {p.status === "paid" || p.status === "completed"
                        ? t("admin.paid")
                        : p.status === "approved"
                        ? t("admin.approved")
                        : t("admin.pendingPayout")}
                    </Badge>
                    {(p.status === "pending" || p.status === "En attente") && (
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
