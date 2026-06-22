"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { organizersService, adminService } from "@/lib/services/organizer-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminOrganizerDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const id = params?.id as string;
  const [organizer, setOrganizer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  useScrollReveal();

  useEffect(() => {
    if (!id) return;
    organizersService
      .findById(id)
      .then((data: any) => {
        setOrganizer(data);
        setIsVerified(data?.verified ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleVerify = async () => {
    try {
      await adminService.verifyOrganizer(id);
      setIsVerified(!isVerified);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-[var(--bg)] flex items-center justify-center">
        <p className="text-sm text-[var(--text-tertiary)]">Chargement...</p>
      </div>
    );
  }

  const name = organizer?.organizationName ?? "Organisateur";
  const initial = name.charAt(0).toUpperCase();
  const email = organizer?.user?.email ?? "";
  const verified = organizer?.verified ?? false;
  const eventsCount = organizer?._count?.events ?? 0;
  const revenue = organizer?.revenue ?? 0;

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <Link
              href="/admin/organizers"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />{" "}
              {t("common.back")}
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent)]/20 flex items-center justify-center card-hover">
                <span className="font-bold text-xl">{initial}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)]">
                    {name}
                  </h1>
                  {verified && (
                    <div>
                      <Check className="w-4 h-4 text-[var(--brand)]" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {email} ·{" "}
                  {verified ? t("admin.verified") : t("admin.unverified")}
                </p>
              </div>
            </div>
            <div>
              <Badge variant={isVerified ? "success" : "soft"}>
                {isVerified ? t("admin.verified") : t("admin.unverified")}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: t("admin.events_stats"), value: String(eventsCount) },
              {
                label: t("admin.revenue"),
                value: `${Number(revenue).toLocaleString()} FCFA`,
              },
              {
                label: t("admin.subscribers"),
                value: String(organizer?._count?.followers ?? 0),
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center card-hover"
              >
                <p className="text-xl font-bold text-[var(--text)]">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-3 card-hover">
            <h3 className="font-semibold text-sm text-[var(--text)]">
              {t("admin.actions")}
            </h3>
            <Button
              variant={isVerified ? "danger" : "outline"}
              size="sm"
              className="w-full pressable"
              onClick={handleToggleVerify}
            >
              {isVerified ? (
                <>
                  <Ban className="w-4 h-4" /> Unverify
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Verify
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
