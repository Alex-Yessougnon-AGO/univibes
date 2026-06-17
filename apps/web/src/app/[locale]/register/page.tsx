"use client";
import { useTranslations } from "next-intl";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { Eye, EyeOff, ArrowRight, Check, Sparkles, GraduationCap, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    university: "",
    password: "",
    role: "student" as "student" | "organizer",
  });

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    alert("Inscription simulée ! (Backend non connecté)");
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      <div className="absolute top-0 left-0 right-0 h-[35dvh] bg-gradient-to-b from-[var(--brand)]/8 to-transparent pointer-events-none" />

      <header className="relative z-10 h-16 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center shadow-[var(--shadow-brand)] transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-black text-sm tracking-tight">UV</span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--text)] tracking-tight">UnivVibes</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-xs font-semibold text-[var(--brand-text)] tracking-wide">
              <Sparkles className="w-3 h-3" />
              {step === 1 ? t("auth.welcome") : t("common.almostDone")}
            </span>
          </motion.div>

          {/* Logo mark */}
          <motion.div variants={fadeUp} className="text-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center mx-auto shadow-[var(--shadow-brand)]">
              <span className="text-white font-black text-3xl tracking-tight">UV</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
              {t("auth.createAccount")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-64 mx-auto leading-relaxed">
              {step === 1
                ? t("auth.welcome") + " " + t("common.appName")
                : t("auth.chooseRole")}
            </p>
          </motion.div>

          {/* Step indicator */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    step >= 1
                      ? "bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] text-white shadow-[var(--shadow-brand)]"
                      : "bg-[var(--border-subtle)] text-[var(--text-tertiary)]"
                  }`}
                >
                  {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className={`text-xs font-medium ${step >= 1 ? "text-[var(--text)]" : "text-[var(--text-tertiary)]"}`}>
                  {t("common.info")}
                </span>
              </div>
              <div className="flex-1 h-px bg-[var(--border)] relative">
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--brand)] transition-all duration-500"
                  style={{ width: step > 1 ? "100%" : "0%" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    step >= 2
                      ? "bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] text-white shadow-[var(--shadow-brand)]"
                      : "bg-[var(--border-subtle)] text-[var(--text-tertiary)]"
                  }`}
                >
                  2
                </div>
                <span className={`text-xs font-medium ${step >= 2 ? "text-[var(--text)]" : "text-[var(--text-tertiary)]"}`}>
                  {t("common.role")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
                    className="space-y-4"
                  >
                    <Input
                      label={t("profile.fullName")}
                      placeholder="Jean Kouamé"
                      value={form.fullname}
                      onChange={(e) => updateField("fullname", e.target.value)}
                      required
                    />
                    <Input
                      label={t("auth.email")}
                      type="email"
                      placeholder="jean@email.com"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                    <Input
                      label={t("profile.phone")}
                      type="tel"
                      placeholder="+229 01 23 45 67"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                    <Input
                      label={t("profile.university")}
                      placeholder="UAC - Université d'Abomey-Calavi"
                      value={form.university}
                      onChange={(e) => updateField("university", e.target.value)}
                    />
                    <Input
                      label={t("auth.password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 caractères"
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      rightIcon={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      required
                    />
                    <Button variant="primary" size="lg" className="w-full mt-2" type="submit">
                      {t("common.continue")}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-[var(--text-secondary)] mb-1">
                      {t("auth.onboarding.interests")}
                    </p>

                    <button
                      type="button"
                      onClick={() => updateField("role", "student")}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        form.role === "student"
                          ? "border-[var(--brand)] bg-[var(--brand-subtle)] shadow-[var(--shadow-sm)]"
                          : "border-[var(--border)] hover:border-[var(--brand)]/30 bg-[var(--surface)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          form.role === "student" ? "bg-[var(--brand)] text-white" : "bg-[var(--border-subtle)] text-[var(--text-tertiary)]"
                        }`}>
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[var(--text)]">{t("profile.student")}</h3>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            {t("auth.onboarding.studentDesc")}
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateField("role", "organizer")}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        form.role === "organizer"
                          ? "border-[var(--brand)] bg-[var(--brand-subtle)] shadow-[var(--shadow-sm)]"
                          : "border-[var(--border)] hover:border-[var(--brand)]/30 bg-[var(--surface)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          form.role === "organizer" ? "bg-[var(--brand)] text-white" : "bg-[var(--border-subtle)] text-[var(--text-tertiary)]"
                        }`}>
                          <CalendarCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[var(--text)]">{t("profile.organizer")}</h3>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            {t("auth.onboarding.organizerDesc")}
                          </p>
                        </div>
                      </div>
                    </button>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full mt-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("common.creating")}
                        </span>
                      ) : (
                        <>
                          {t("auth.createMyAccount")}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Login link */}
          <motion.div variants={fadeUp} className="mt-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {t("auth.hasAccount")}{" "}
              <Link
                href="/login"
                className="text-[var(--brand)] font-semibold hover:text-[var(--brand-hover)] transition-colors"
              >
                {t("auth.signIn")}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
