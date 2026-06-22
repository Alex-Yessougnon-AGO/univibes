"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Bell, Mail, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const NOTIF_TYPES = [
  "ticketPurchased",
  "eventReminder",
  "eventApproved",
  "eventRejected",
  "paymentConfirmed",
  "promotions",
] as const;

export default function NotificationsPage() {
  const t = useTranslations();

  const [pushEnabled, setPushEnabled] = useState(true);
  useScrollReveal();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushPrefs, setPushPrefs] = useState<Record<string, boolean>>({
    ticketPurchased: true,
    eventReminder: true,
    eventApproved: true,
    eventRejected: false,
    paymentConfirmed: true,
    promotions: false,
  });
  const [emailPrefs, setEmailPrefs] = useState<Record<string, boolean>>({
    ticketPurchased: true,
    eventReminder: true,
    eventApproved: true,
    eventRejected: false,
    paymentConfirmed: true,
    promotions: false,
  });
  const [saved, setSaved] = useState(false);

  const togglePush = (key: string) =>
    setPushPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleEmail = (key: string) =>
    setEmailPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      <header className="relative z-10 h-16 flex items-center px-5 border-b border-[var(--border)]">
        <Link
          href="/profile"
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          {t("common.back")}
        </Link>
      </header>

      <main className="flex-1">
        <div className="relative pt-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 to-transparent pointer-events-none" />
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <div
              >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <Sparkles className="w-3 h-3" />
                {t("profile.notifications")}
              </span>
              <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
                {t("notifPrefs.title")}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {t("notifPrefs.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div
         
         
          
          className="max-w-2xl mx-auto px-4 sm:px-6 pb-12 space-y-6"
        >
          {/* Push notifications */}
          <div
            
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)] card-hover"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--brand)]" />
                <h2 className="font-semibold text-sm text-[var(--text)]">
                  {t("notifPrefs.push")}
                </h2>
              </div>
              <button
                onClick={() => setPushEnabled(!pushEnabled)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer",
                  pushEnabled ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                    pushEnabled ? "translate-x-5.5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
            <div
              className={cn(
                "divide-y divide-[var(--border-subtle)] transition-opacity duration-300",
                pushEnabled ? "" : "opacity-40 pointer-events-none"
              )}
            >
              {NOTIF_TYPES.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm text-[var(--text)]">
                      {t(`notifPrefs.${key}`)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {t(`notifPrefs.${key}Desc`)}
                    </p>
                  </div>
                  <button
                    onClick={() => togglePush(key)}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer",
                      pushPrefs[key] ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                        pushPrefs[key] ? "translate-x-5.5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Email notifications */}
          <div
            
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)] card-hover"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--brand)]" />
                <h2 className="font-semibold text-sm text-[var(--text)]">
                  {t("notifPrefs.email")}
                </h2>
              </div>
              <button
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer",
                  emailEnabled ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                    emailEnabled ? "translate-x-5.5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
            <div
              className={cn(
                "divide-y divide-[var(--border-subtle)] transition-opacity duration-300",
                emailEnabled ? "" : "opacity-40 pointer-events-none"
              )}
            >
              {NOTIF_TYPES.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm text-[var(--text)]">
                      {t(`notifPrefs.${key}`)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {t(`notifPrefs.${key}Desc`)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleEmail(key)}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer",
                      emailPrefs[key] ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                        emailPrefs[key] ? "translate-x-5.5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div >
            <Button
              variant="primary"
              size="lg"
              className="w-full pressable"
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" /> {t("notifPrefs.preferencesSaved")}
                </>
              ) : (
                t("notifPrefs.savePreferences")
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
