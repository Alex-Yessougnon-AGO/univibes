"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { adminService } from "@/lib/services/organizer-service";
import { eventsService } from "@/lib/services/events-service";

export default function AdminEventsPage() {
  const t = useTranslations();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    eventsService.findAll({ limit: 100 })
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setEvents(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveEvent(id);
      setEvents(events.filter((e: any) => e.id !== id));
    } catch {}
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectEvent(id);
      setEvents(events.filter((e: any) => e.id !== id));
    } catch {}
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">{t("admin.events")}</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{t("admin.eventsManagementDesc")}</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">Chargement...</div>
      ) : (
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)] card-hover">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/50">
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t("admin.tableEvent")}</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">{t("admin.tableOrganizer")}</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">{t("event.date")}</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">{t("admin.tableStatus")}</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">{t("admin.tableViews")}</th>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t("admin.tableActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {events.map((event: any) => (
                  <tr key={event.id} className="hover:bg-[var(--border-subtle)]/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                          <Image src={event.coverImage || `https://picsum.photos/seed/${event.slug}/100/100`} alt={event.title} fill className="object-cover" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text)] truncate">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell text-sm text-[var(--text-secondary)]">{event.organizer?.organizationName || event.organizer?.name || '—'}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-sm text-[var(--text-secondary)]">{formatShortDate(event.startDate)}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <Badge variant={event.status === 'approved' ? "success" : event.status === 'pending' ? "warning" : "soft"}>
                        {event.status === 'approved' ? t("admin.approved") : event.status === 'pending' ? t("admin.pendingEvent") : event.status || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-[var(--text-secondary)]">{(event.views || 0).toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleApprove(event.id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200/50">{t("admin.approve")}</button>
                        <button onClick={() => handleReject(event.id)} className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-200/50">{t("admin.reject")}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
