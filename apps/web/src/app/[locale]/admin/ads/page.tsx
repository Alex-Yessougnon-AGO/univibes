"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { adsService } from "@/lib/services/organizer-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminAdsPage() {
  const t = useTranslations();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    adsService
      .findAll()
      .then((data: any) => setAds(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
            <Megaphone className="w-3 h-3" />
            {t("admin.ads")}
          </span>
          <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
            {t("admin.ads")}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {t("admin.adsManagementDesc")}
          </p>
        </div>
        <Link href="/admin/ads/create">
          <Button variant="primary" size="sm" className="pressable">
            <Plus className="w-4 h-4" />
            {t("admin.newAd")}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
          Chargement...
        </div>
      ) : ads.length === 0 ? (
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-12 text-center card-hover">
          <Megaphone className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">
            {t("admin.noAds")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad: any) => (
            <div
              key={ad.id}
              className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)] card-hover"
            >
              <div className="relative aspect-[2/1]">
                {ad.imageUrl || ad.image ? (
                  <Image
                    src={ad.imageUrl ?? ad.image}
                    alt={ad.name ?? ad.campaignName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 flex items-center justify-center">
                    <Megaphone className="w-8 h-8 text-[var(--text-tertiary)]" />
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-[var(--text)]">
                    {ad.name ?? ad.campaignName}
                  </h3>
                  <Badge variant={ad.active ?? ad.status === "active" ? "success" : "soft"}>
                    {ad.active ?? ad.status === "active"
                      ? t("admin.active")
                      : t("admin.inactive")}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[var(--text-tertiary)]">
                      {t("admin.city")} :
                    </span>
                    <span className="text-[var(--text-secondary)] ml-1">
                      {ad.targetCity ?? ad.city ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)]">
                      {t("admin.impressions")} :
                    </span>
                    <span className="text-[var(--text-secondary)] ml-1">
                      {ad.impressions?.toLocaleString() ?? ad.views ?? "0"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)]">
                      {t("admin.dateStart")} :
                    </span>
                    <span className="text-[var(--text-secondary)] ml-1">
                      {ad.startDate ?? ad.start ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)]">
                      {t("admin.clicks")} :
                    </span>
                    <span className="text-[var(--text-secondary)] ml-1">
                      {ad.clicks?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
