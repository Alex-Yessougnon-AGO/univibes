"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adsService } from "@/lib/services/organizer-service";
import { getApiErrorMessage } from "@/lib/api-client";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function CreateAdPage() {
  const t = useTranslations();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    targetCity: "",
    budget: "",
    startDate: "",
    endDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  useScrollReveal();

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.targetCity.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await adsService.create({
        name: form.name,
        targetCity: form.targetCity,
        budget: Number(form.budget) || 0,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      router.push("/admin/ads");
    } catch (err: any) {
      setError(getApiErrorMessage(err) || t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <Link
              href="/admin/ads"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />{" "}
              {t("common.back")}
            </Link>

            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
              {t("admin.createAd")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {t("admin.createAdDesc")}
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)] card-hover">
            <div className="aspect-[2/1] rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--brand)]/30 transition-colors flex flex-col items-center justify-center cursor-pointer bg-[var(--border-subtle)]/50">
              <Upload className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                {t("admin.adBanner")}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {t("admin.adBannerSize")}
              </p>
            </div>

            <Input
              label={t("admin.campaignName")}
              placeholder="Ex: Campagne rentrée UAC"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label={t("admin.targetCity")}
              placeholder={t("admin.cities")}
              value={form.targetCity}
              onChange={(e) => setForm({ ...form, targetCity: e.target.value })}
            />
            <Input
              label={t("admin.budget")}
              type="number"
              placeholder="50 000"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t("admin.dateStart")}
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              <Input
                label={t("admin.dateEnd")}
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <Button
                variant="primary"
                size="lg"
                className="w-full pressable"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? t("common.creating")
                  : t("admin.createCampaign")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
