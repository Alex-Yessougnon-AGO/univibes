"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminEventDetailPage() {
  const t = useTranslations();
  const params = useParams();
  useScrollReveal();

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div >
          <div >
            <Link href="/admin/events" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> {t("common.back")}
            </Link>
          </div>

          <div
            className="aspect-[21/9] rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center mb-6 text-sm text-[var(--text-tertiary)] card-hover"
          >
            {t("admin.exhibitor")}
          </div>

          <div  className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div >
                  <Badge variant="success">{t("admin.published")}</Badge>
                </div>
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">Gala de Fin d&apos;Année FASEG</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Club Culturel UAC · 15 juil. 2025 · Abomey-Calavi</p>
            </div>
          </div>

          <div  className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Eye, color: "text-[var(--brand)]", key: "views", value: "12.4k" },
              { icon: Heart, color: "text-rose-500", key: "favorites", value: "843" },
              { icon: Users, color: "text-emerald-500", key: "participants", value: "156" },
            ].map((stat, i) => (
              <div
                key={stat.key}
                className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center card-hover"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                <p className="text-xl font-bold text-[var(--text)]">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{t("event." + stat.key)}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] space-y-3 card-hover"
          >
            <h3 className="font-semibold text-sm text-[var(--text)]">{t("admin.actions")}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 pressable">{t("admin.feature")}</Button>
              <Button variant="danger" size="sm" className="flex-1 pressable">{t("admin.archive")}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
