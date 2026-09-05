"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Plus,
  Calendar,
  ArrowRight,
  Eye,
  Heart,
  Ticket,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const RECENT_EVENTS = [
  { name: "Gala de Fin d'Année FASEG", status: "Approuvé", tickets: 89, views: 12400 },
  { name: "Speed Networking Étudiants", status: "En attente", tickets: 45, views: 2800 },
  { name: "Campus Afterwork", status: "Brouillon", tickets: 0, views: 0 },
];

const statusVariant = (s: string) => {
  if (s === "Approuvé") return "success" as const;
  if (s === "En attente") return "warning" as const;
  return "soft" as const;
};

export default function DashboardPage() {
  const t = useTranslations();
  useScrollReveal();

  const STATS = [
    { label: t("event.views"), value: "12 400", icon: Eye, delta: "+12%" },
    { label: t("event.favorites"), value: "843", icon: Heart, delta: "+8%" },
    { label: t("analytics.ticketsSold"), value: "156", icon: Ticket, delta: "+23%" },
    { label: t("analytics.revenue"), value: "780 000", icon: Wallet, delta: "+15%", hint: "FCFA · " + t("analytics.vsPrevious") },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("nav.dashboard")}
        title={t("nav.dashboard")}
        description={t("analytics.subtitle")}
        actions={
          <Button variant="primary" size="md" className="rounded-full" asChild>
            <Link href="/dashboard/events/new">
              <Plus className="w-4 h-4" aria-hidden="true" />
              {t("hero.createEvent")}
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              delta={stat.delta}
              hint={"hint" in stat ? (stat as { hint: string }).hint : t("analytics.vsPrevious")}
            />
          </div>
        ))}
      </div>

      <div className="reveal card-xl p-6 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[15px] text-[var(--text)] flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
            </span>
            {t("admin.events")}
          </h2>
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link href="/dashboard/events">
              {t("common.seeAll")}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="space-y-1">
          {RECENT_EVENTS.map((evt) => (
            <div
              key={evt.name}
              className="flex items-center justify-between gap-4 p-3.5 rounded-2xl hover:bg-[var(--border-subtle)] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center shrink-0">
                  <Calendar className="w-[18px] h-[18px] text-[var(--brand)]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--text)] truncate">{evt.name}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                    {evt.views.toLocaleString()} {t("event.views")} · {evt.tickets} {t("ticket.title")}
                  </p>
                </div>
              </div>
              <Badge variant={statusVariant(evt.status)}>{evt.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-5">
        <Link
          href="/dashboard/events/new"
          className="reveal card-xl p-6 card-hover flex items-center gap-4"
        >
          <span className="w-12 h-12 rounded-2xl bg-[var(--brand-subtle)] flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5 text-[var(--brand)]" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-bold text-sm text-[var(--text)]">{t("hero.createEvent")}</span>
            <span className="block text-[13px] text-[var(--text-secondary)] mt-1">
              {t("analytics.subtitle")}
            </span>
          </span>
        </Link>
        <Link
          href="/dashboard/analytics"
          className="reveal card-xl p-6 card-hover flex items-center gap-4"
          style={{ transitionDelay: "80ms" }}
        >
          <span className="w-12 h-12 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-bold text-sm text-[var(--text)]">{t("analytics.title")}</span>
            <span className="block text-[13px] text-[var(--text-secondary)] mt-1">
              {t("analytics.overview")}
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
