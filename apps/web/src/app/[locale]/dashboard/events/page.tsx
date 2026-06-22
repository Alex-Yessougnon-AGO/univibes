"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Plus, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVENTS } from "@/lib/mock-data";
import { formatShortDate, formatCurrency } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const statusBadge = (status?: string) => {
  if (status === "approved") return "success" as const;
  if (status === "pending") return "warning" as const;
  if (status === "draft") return "soft" as const;
  if (status === "rejected") return "error" as const;
  if (status === "archived") return "outline" as const;
  return "soft" as const;
};

const statusLabel = (status?: string) => {
  if (status === "approved") return "Approuvé";
  if (status === "pending") return "En attente";
  if (status === "draft") return "Brouillon";
  if (status === "rejected") return "Rejeté";
  if (status === "archived") return "Archivé";
  return "N/A";
};

export default function DashboardEventsPage() {
  const t = useTranslations();
  return (
    <div
     
     
      
    >
      <div  className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("admin.events")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{EVENTS.length} {t("admin.events")}</p>
        </div>
        <Button variant="primary" size="md" asChild className="pressable">
          <Link href="/dashboard/events/new">
            <Plus className="w-4 h-4" />
            {t("hero.createEvent")}
          </Link>
        </Button>
      </div>

      <div  className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)] card-hover">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/50">
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t("admin.events")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">{t("event.date")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">Statut</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">{t("event.views")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">Prix</th>
                <th className="w-10 px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-[var(--border-subtle)]/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <Link href={`/dashboard/events/${event.id}`} className="flex items-center gap-3 min-w-0 group">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                        <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--brand)] transition-colors truncate">{event.title}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{event.location}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-[var(--text-secondary)]">{formatShortDate(event.startDate)}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <Badge variant={statusBadge(event.status)}>{statusLabel(event.status)}</Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-[var(--text-secondary)]">{event.views.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-sm font-medium text-[var(--brand)]">
                      {event.isFree ? t("event.free") : formatCurrency(event.lowestPrice ?? 0)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/dashboard/events/${event.id}`} className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)] transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  useScrollReveal();
}
