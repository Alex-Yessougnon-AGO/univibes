"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { ArrowLeft, Bell, Shield, Trash2, User, Sparkles, Moon, Sun, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

const SETTINGS_SECTIONS = [
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    items: [
      { label: "Rappels d'événements", key: "reminders", default: true },
      { label: "Nouveaux favoris", key: "favorites", default: true },
      { label: "Recommandations", key: "recommendations", default: false },
      { label: "Offres et promotions", key: "promotions", default: false },
    ],
  },
  {
    id: "privacy",
    icon: Shield,
    label: "Confidentialité",
    items: [
      { label: "Profil visible par tous", key: "public_profile", default: true },
      { label: "Montrer ma liste de favoris", key: "public_favorites", default: false },
      { label: "Recevoir des messages", key: "messages", default: true },
    ],
  },
];

export default function SettingsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    reminders: true,
    favorites: true,
    recommendations: false,
    promotions: false,
    public_profile: true,
    public_favorites: false,
    messages: true,
  });

  const toggle = (key: string) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      <header className="relative z-10 h-16 flex items-center px-5 border-b border-[var(--border)]">
        <Link href="/profile" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Retour
        </Link>
      </header>

      <main className="flex-1">
        <div className="relative pt-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 to-transparent pointer-events-none" />
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <Sparkles className="w-3 h-3" />
                Paramètres
              </span>
              <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
                Paramètres du compte
              </h1>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="max-w-2xl mx-auto px-4 sm:px-6 pb-12 space-y-6"
        >
          {/* Apparence */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] space-y-4">
            <h2 className="font-semibold text-sm text-[var(--text)]">Apparence</h2>

            {/* Theme toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--border-subtle)] flex items-center justify-center">
                  {theme === "dark" ? <Moon className="w-4 h-4 text-[var(--text-secondary)]" /> : <Sun className="w-4 h-4 text-[var(--text-secondary)]" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Thème</p>
                  <p className="text-xs text-[var(--text-secondary)]">{theme === "dark" ? "Sombre" : "Clair"}</p>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-12 h-6 rounded-full bg-[var(--border)] cursor-pointer transition-colors"
              >
                <div className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                  theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                )} />
              </button>
            </div>

            {/* Language selector */}
            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--border-subtle)] flex items-center justify-center">
                  <Languages className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text)]">{t("nav.language")}</p>
                </div>
              </div>
              <div className="flex mt-3 rounded-xl border border-[var(--border)] overflow-hidden">
                <button
                  onClick={() => switchLocale("fr")}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    locale === "fr"
                      ? "bg-[var(--brand)] text-white"
                      : "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)]"
                  )}
                >
                  🇫🇷 {t("nav.french")}
                </button>
                <div className="w-px bg-[var(--border)]" />
                <button
                  onClick={() => switchLocale("en")}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    locale === "en"
                      ? "bg-[var(--brand)] text-white"
                      : "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)]"
                  )}
                >
                  🇬🇧 {t("nav.english")}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sections dynamiques */}
          {SETTINGS_SECTIONS.map((section) => (
            <motion.div key={section.id} variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
              <div className="px-5 pt-5 pb-2">
                <div className="flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-[var(--brand)]" />
                  <h2 className="font-semibold text-sm text-[var(--text)]">{section.label}</h2>
                </div>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {section.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm text-[var(--text)]">{item.label}</span>
                    <button
                      onClick={() => toggle(item.key)}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors shrink-0",
                        settings[item.key] ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                        settings[item.key] ? "translate-x-5.5" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Danger zone */}
          <motion.div variants={fadeUp}>
            <button className="w-full flex items-center justify-center gap-2 p-4 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-2xl transition-colors border border-rose-200/50 dark:border-rose-900/30">
              <Trash2 className="w-4 h-4" />
              Supprimer mon compte
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
