"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  TrendingUp,
  Ticket,
  DollarSign,
  Eye,
  Heart,
  Download,
  BarChart3,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { EVENTS } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const PERIODS = ["today", "week", "month", "year", "allTime"] as const;

export default function AnalyticsPage() {
  const t = useTranslations();
  const [period, setPeriod] = useState<string>("month");
  useScrollReveal();

  const { eventData, totals, topEvents } = useMemo(() => {
    const data = EVENTS.map((event) => {
      const ticketsSold =
        event.tickets?.reduce((sum, t) => sum + (t.total - t.remaining), 0) || 0;
      const revenue =
        event.tickets?.reduce(
          (sum, t) => sum + t.price * (t.total - t.remaining),
          0,
        ) || 0;
      const totalCapacity =
        event.tickets?.reduce((sum, t) => sum + t.total, 0) || 0;

      return {
        id: event.id,
        title: event.title,
        ticketsSold,
        revenue,
        views: event.views,
        favorites: event.favoritesCount,
        totalCapacity,
      };
    });

    const totalTicketsSold = data.reduce((s, e) => s + e.ticketsSold, 0);
    const totalRevenue = data.reduce((s, e) => s + e.revenue, 0);
    const totalViews = data.reduce((s, e) => s + e.views, 0);
    const totalFavorites = data.reduce((s, e) => s + e.favorites, 0);

    const sorted = [...data].sort(
      (a, b) =>
        b.ticketsSold * 3 +
        b.views * 0.5 +
        b.favorites * 1.5 -
        (a.ticketsSold * 3 + a.views * 0.5 + a.favorites * 1.5),
    );

    return {
      eventData: data,
      totals: {
        ticketsSold: totalTicketsSold,
        revenue: totalRevenue,
        views: totalViews,
        favorites: totalFavorites,
        conversionRate:
          totalViews > 0 ? (totalTicketsSold / totalViews) * 100 : 0,
      },
      topEvents: sorted,
    };
  }, []);

  const salesData = useMemo(() => {
    const points: { label: string; value: number }[] = [];

    if (period === "today") {
      for (let i = 0; i < 12; i++) {
        points.push({
          label: `${(i * 2).toString().padStart(2, "0")}h`,
          value: Math.floor(Math.random() * 50) + 5,
        });
      }
    } else if (period === "week") {
      const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      for (let i = 0; i < 7; i++) {
        points.push({ label: days[i], value: Math.floor(Math.random() * 70) + 10 });
      }
    } else if (period === "month") {
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        points.push({
          label: `${d.getDate()}/${d.getMonth() + 1}`,
          value: Math.floor(Math.random() * 60) + 5,
        });
      }
    } else {
      const months = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
        "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
      ];
      for (let i = 0; i < 12; i++) {
        points.push({
          label: months[i],
          value: Math.floor(Math.random() * 90) + 10,
        });
      }
    }

    return points;
  }, [period]);

  const maxSalesValue = Math.max(...salesData.map((d) => d.value), 1);

  const kpis = [
    {
      key: "ticketsSold" as const,
      value: totals.ticketsSold.toLocaleString(),
      icon: Ticket,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
      vs: "+23%",
      up: true,
    },
    {
      key: "revenue" as const,
      value: formatCurrency(totals.revenue),
      icon: DollarSign,
      color: "text-[var(--brand)]",
      bg: "bg-[var(--brand-subtle)]",
      vs: "+15%",
      up: true,
    },
    {
      key: "views" as const,
      value: totals.views.toLocaleString(),
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      vs: "+8%",
      up: true,
    },
    {
      key: "favorites" as const,
      value: totals.favorites.toLocaleString(),
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/10",
      vs: "+12%",
      up: true,
    },
    {
      key: "conversionRate" as const,
      value: `${totals.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-[var(--accent)]",
      bg: "bg-[var(--accent-subtle)]",
      vs: "-2%",
      up: false,
    },
  ];

  if (eventData.length === 0) {
    return (
      <div
        
       
       
        className="flex flex-col items-center justify-center py-20"
      >
        <BarChart3 className="w-12 h-12 text-[var(--text-secondary)] mb-4" />
        <p className="text-[var(--text-secondary)]">{t("analytics.noData")}</p>
      </div>
    );
  }

  return (
    <div
      
     
     
    >
      {/* Header */}
      <div
        
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
            <BarChart3 className="w-3 h-3" />
            {t("analytics.overview")}
          </span>
          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">
            {t("analytics.title")}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {t("analytics.subtitle")}
          </p>
        </div>
        <Button variant="outline" size="sm" className="pressable">
          <Download className="w-4 h-4" />
          {t("analytics.exportData")}
        </Button>
      </div>

      {/* Period selector */}
      <div
        
        className="flex items-center gap-2 mb-6 flex-wrap"
      >
        <span className="text-xs font-medium text-[var(--text-secondary)] mr-1">
          {t("analytics.period")}:
        </span>
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              period === p
                ? "bg-[var(--brand)] text-white shadow-[var(--shadow-brand)]"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--border-subtle)]",
            )}
          >
            {t(`analytics.${p}`)}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div
        
        className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
      >
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  kpi.bg,
                )}
              >
                <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              </div>
              <Badge
                variant={kpi.up ? "success" : "error"}
                className="text-[10px]"
                title={t("analytics.vsPrevious")}
              >
                {kpi.vs}
              </Badge>
            </div>
            <p className="text-2xl font-extrabold text-[var(--text)]">
              {kpi.value}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {t(`analytics.${kpi.key}`)}
            </p>
          </div>
        ))}
      </div>

      {/* Sales over time chart */}
      <div
        
        className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] mb-6 card-hover"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-[var(--text)] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--brand)]" />
            {t("analytics.salesOverTime")}
          </h2>
          <span className="text-xs text-[var(--text-secondary)]">
            {t(
              `analytics.${
                period === "today"
                  ? "dailySales"
                  : period === "week"
                    ? "weeklySales"
                    : "monthlySales"
              }`,
            )}
          </span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div
            className={cn(
              "flex items-end gap-[3px] h-52 min-w-[300px]",
              salesData.length > 20 && "min-w-[600px]",
            )}
          >
            {salesData.map((point, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end min-w-[8px] group"
              >
                <span className="text-[9px] font-medium text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  {point.value}
                </span>
                <div
                  className="w-full rounded-sm transition-all duration-500 ease-out"
                  style={{
                    height: `${Math.max((point.value / maxSalesValue) * 100, 2)}%`,
                    background:
                      "linear-gradient(180deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 60%, transparent) 100%)",
                    opacity: 0.6 + (point.value / maxSalesValue) * 0.4,
                  }}
                />
                <span className="text-[9px] text-[var(--text-secondary)] whitespace-nowrap">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets by event */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div
          
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] card-hover"
        >
          <h2 className="font-semibold text-[var(--text)] flex items-center gap-2 mb-5">
            <Ticket className="w-4 h-4 text-[var(--brand)]" />
            {t("analytics.ticketsByEvent")}
          </h2>
          <div className="space-y-4">
            {eventData.map((event) => {
              const pct =
                event.totalCapacity > 0
                  ? (event.ticketsSold / event.totalCapacity) * 100
                  : 0;
              return (
                <div key={event.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[var(--text)] truncate mr-2">
                      {event.title}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                      {event.ticketsSold}/{event.totalCapacity}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        background:
                          "linear-gradient(90deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 70%, var(--accent)) 100%)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top events */}
        <div
          
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] card-hover"
        >
          <h2 className="font-semibold text-[var(--text)] flex items-center gap-2 mb-5">
            <Trophy className="w-4 h-4 text-[var(--gold)]" />
            {t("analytics.topEvents")}
          </h2>
          <div className="space-y-1">
            {topEvents.slice(0, 5).map((event, index) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--border-subtle)] transition-colors"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                    index === 0 &&
                      "bg-[var(--gold-subtle)] text-[var(--gold)]",
                    index === 1 && "bg-gray-100 dark:bg-gray-800 text-gray-500",
                    index === 2 &&
                      "bg-orange-50 dark:bg-orange-900/10 text-orange-600",
                    index > 2 &&
                      "bg-[var(--border-subtle)] text-[var(--text-secondary)]",
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {event.ticketsSold} {t("analytics.ticketsSold").toLowerCase()} ·{" "}
                    {formatCurrency(event.revenue)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {event.ticketsSold}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {t("analytics.views").toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
