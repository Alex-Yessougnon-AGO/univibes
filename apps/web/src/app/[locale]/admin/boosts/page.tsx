"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/lib/services/organizer-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminBoostsPage() {
  const t = useTranslations();
  const [boosts, setBoosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    adminService
      .getBoosts()
      .then((data: any) => setBoosts(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const boostTypeLabel = (type: string) => {
    if (type === "h24") return "24h";
    if (type === "h72") return "72h";
    if (type === "days7") return "7 jours";
    return type;
  };

  const statusVariant = (status: string) => {
    if (status === "active" || status === "Actif") return "success" as const;
    if (status === "pending" || status === "Planifié") return "warning" as const;
    return "soft" as const;
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
          {t("admin.boosts")}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {t("admin.boostManagementDesc")}
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
          Chargement...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: t("admin.activeBoosts"),
                value: String(
                  boosts.filter((b: any) => b.status === "active").length
                ),
              },
              {
                label: t("admin.expiredBoosts"),
                value: String(
                  boosts.filter((b: any) => b.status === "expired").length
                ),
              },
              {
                label: t("admin.totalBoosts"),
                value: String(boosts.length),
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/50">
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      {t("admin.tableEvent")}
                    </th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">
                      {t("admin.tableOrganizer")}
                    </th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      {t("admin.tableType")}
                    </th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">
                      {t("admin.tableStart")}
                    </th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      {t("admin.tableStatus")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {boosts.map((boost: any) => (
                    <tr
                      key={boost.id}
                      className="hover:bg-[var(--border-subtle)]/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm font-medium text-[var(--text)]">
                        {boost.event?.title ?? boost.event ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-sm text-[var(--text-secondary)]">
                        {boost.organizer?.organizationName ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">
                        {boostTypeLabel(boost.boostType)}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-sm text-[var(--text-secondary)]">
                        {boost.startDate
                          ? new Date(boost.startDate).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={statusVariant(boost.status)}>
                          {boost.status === "active"
                            ? t("admin.active")
                            : boost.status === "expired"
                            ? t("admin.expired")
                            : boost.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
