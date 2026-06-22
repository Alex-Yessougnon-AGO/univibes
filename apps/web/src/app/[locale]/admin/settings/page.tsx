"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminService } from "@/lib/services/organizer-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminSettingsPage() {
  const t = useTranslations();
  const [settings, setSettings] = useState({
    commission: "5",
    maxEventsPerOrg: "50",
    requireVerification: "yes",
    maintenance: "no",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useScrollReveal();

  useEffect(() => {
    adminService
      .getSettings()
      .then((data: any) => {
        if (data) {
          setSettings({
            commission: String(data.commission ?? 5),
            maxEventsPerOrg: String(data.maxEventsPerOrg ?? 50),
            requireVerification: data.requireVerification === false ? "no" : "yes",
            maintenance: data.maintenance === true ? "yes" : "no",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await adminService.updateSettings({
        commission: Number(settings.commission),
        maxEventsPerOrg: Number(settings.maxEventsPerOrg),
        requireVerification: settings.requireVerification === "yes",
        maintenance: settings.maintenance === "yes",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
              {t("admin.settings")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {t("admin.settingsDesc")}
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)] card-hover">
            <Input
              label={t("admin.commission")}
              type="number"
              value={settings.commission}
              onChange={(e) =>
                setSettings({ ...settings, commission: e.target.value })
              }
            />
            <Input
              label={t("admin.maxEvents")}
              type="number"
              value={settings.maxEventsPerOrg}
              onChange={(e) =>
                setSettings({ ...settings, maxEventsPerOrg: e.target.value })
              }
            />

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                {t("admin.requireVerification")}
              </label>
              <select
                className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
                value={settings.requireVerification}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireVerification: e.target.value,
                  })
                }
              >
                <option value="yes">{t("admin.yes")}</option>
                <option value="no">{t("admin.no")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                {t("admin.maintenanceMode")}
              </label>
              <select
                className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
                value={settings.maintenance}
                onChange={(e) =>
                  setSettings({ ...settings, maintenance: e.target.value })
                }
              >
                <option value="no">{t("admin.disabled")}</option>
                <option value="yes">{t("admin.enabled")}</option>
              </select>
            </div>

            <div>
              <Button
                variant="primary"
                size="md"
                className="pressable"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? t("common.saving") : <><Save className="w-4 h-4" /> {t("common.save")}</>}
              </Button>
              {saved && (
                <span className="ml-3 text-xs text-emerald-600">
                  ✓ {t("common.saved")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
