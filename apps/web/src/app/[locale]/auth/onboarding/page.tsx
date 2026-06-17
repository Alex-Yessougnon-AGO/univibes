"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Check, GraduationCap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STEPS = ["Profil", "Centres d'intérêt", "Terminé"];

const INTERESTS = ["Concerts", "Conférences", "Sport", "Gala", "Hackathons", "Théâtre", "Afterworks", "Ateliers", "Expositions"];

export default function OnboardingPage() {
  const t = useTranslations();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (i: string) => {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <header className="h-16 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center shadow-[var(--shadow-brand)]">
            <span className="text-white font-black text-sm">UV</span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--text)]">{t("common.appName")}</span>
        </Link>
      </header>

      <main className="px-5 pb-12 max-w-md mx-auto">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((_, i) => (
            <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i <= step ? "w-8 bg-[var(--brand)]" : "w-4 bg-[var(--border)]")} />
          ))}
        </div>

        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-brand)]">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("auth.onboarding.welcome")}</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5">{t("auth.onboarding.personalize")}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4 shadow-[var(--shadow)]">
              <Input label={t("auth.onboarding.firstName")} placeholder="Alex" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label={t("auth.onboarding.university")} placeholder="UAC" value={university} onChange={(e) => setUniversity(e.target.value)} />
            </div>
            <Button variant="primary" size="lg" className="w-full" onClick={() => setStep(1)} disabled={!name.trim()}>
              {t("common.confirm")} <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/15 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-7 h-7 text-[var(--brand)]" />
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("auth.onboarding.interests")}</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5">{t("auth.onboarding.interestsSubtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {INTERESTS.map((i) => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                    interests.includes(i)
                      ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                      : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setStep(0)}>{t("common.back")}</Button>
              <Button variant="primary" size="md" className="flex-1" onClick={() => setStep(2)}>{t("common.confirm")}</Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("auth.onboarding.ready", { name })}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{t("auth.onboarding.readySubtitle")}</p>
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/home">{t("home.discoverEvents")} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
