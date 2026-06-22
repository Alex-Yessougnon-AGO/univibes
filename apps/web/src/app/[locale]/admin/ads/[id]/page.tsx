"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, MousePointer, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adsService } from "@/lib/services/organizer-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminAdDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const id = params?.id as string;
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    if (!id) return;
    adsService
      .findOne(id)
      .then((data: any) => setAd(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-[var(--bg)] flex items-center justify-center">
        <p className="text-sm text-[var(--text-tertiary)]">Chargement...</p>
      </div>
    );
  }

  const name = ad?.advertiserName ?? ad?.name ?? "Campagne";
  const city = ad?.targetCity ?? "Toutes";
  const isActive = ad?.active ?? true;
  const impressions = ad?.impressions ?? 0;
  const clicks = ad?.clicks ?? 0;
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : "0.0";
  const start = ad?.startDate ? new Date(ad.startDate).toLocaleDateString("fr-FR") : "—";
  const end = ad?.endDate ? new Date(ad.endDate).toLocaleDateString("fr-FR") : "—";

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <Link
              href="/admin/ads"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />{" "}
              {t("common.back")}
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <div>
                <Badge
                  variant={isActive ? "success" : "soft"}
                  className="mb-2"
                >
                  {isActive ? t("admin.active") : t("admin.inactive")}
                </Badge>
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">
                {name}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {t("admin.city")} : {city}
              </p>
            </div>
          </div>

          <div className="aspect-[3/1] rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center mb-6 text-sm text-[var(--text-tertiary)] card-hover">
            {t("admin.posterPreview")}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Eye, key: "impressions", value: impressions.toLocaleString() },
              { icon: MousePointer, key: "clicks", value: clicks.toLocaleString() },
              { icon: TrendingUp, key: "ctr", value: `${ctr}%` },
            ].map((stat) => (
              <div
                key={stat.key}
                className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center card-hover"
              >
                <stat.icon className="w-5 h-5 text-[var(--brand)] mx-auto mb-1" />
                <p className="text-xl font-bold text-[var(--text)]">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t("admin." + stat.key)}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-2 text-sm card-hover">
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">
                {t("admin.dateStart")}
              </span>
              <span className="text-[var(--text)]">{start}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">
                {t("admin.dateEnd")}
              </span>
              <span className="text-[var(--text)]">{end}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
