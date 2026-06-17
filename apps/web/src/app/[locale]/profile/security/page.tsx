"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeUp, containerStagger } from "@/lib/motion";
import {
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Globe,
  Shield,
  Clock,
  Check,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn, timeAgo } from "@/lib/utils";

const MOCK_SESSIONS = [
  {
    id: "1",
    device: "iPhone 15 Pro",
    browser: "Safari",
    location: "Cotonou, Bénin",
    ip: "197.xx.xx.1",
    isCurrent: true,
    lastActive: new Date().toISOString(),
    icon: Smartphone,
  },
  {
    id: "2",
    device: "MacBook Air M3",
    browser: "Chrome",
    location: "Abomey-Calavi, Bénin",
    ip: "197.xx.xx.42",
    isCurrent: false,
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    icon: Monitor,
  },
  {
    id: "3",
    device: "Samsung Galaxy S24",
    browser: "Chrome Mobile",
    location: "Porto-Novo, Bénin",
    ip: "197.xx.xx.88",
    isCurrent: false,
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: Smartphone,
  },
];

const MOCK_LOGIN_HISTORY = [
  { id: "1", device: "iPhone 15 Pro · Safari", location: "Cotonou, Bénin", ip: "197.xx.xx.1", date: new Date().toISOString() },
  { id: "2", device: "MacBook Air M3 · Chrome", location: "Abomey-Calavi, Bénin", ip: "197.xx.xx.42", date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: "3", device: "Samsung Galaxy S24 · Chrome Mobile", location: "Porto-Novo, Bénin", ip: "197.xx.xx.88", date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "4", device: "iPhone 15 Pro · Safari", location: "Cotonou, Bénin", ip: "197.xx.xx.1", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

export default function SecurityPage() {
  const t = useTranslations("security");
  const tc = useTranslations("common");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) return;
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordFeedback({ type: "error", message: t("passwordError") });
      return;
    }
    setPasswordFeedback({ type: "success", message: t("passwordUpdated") });
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordFeedback(null), 3000);
  };

  const handleRevokeAll = () => {
    setRevoking(true);
    setTimeout(() => setRevoking(false), 1500);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-8 pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--brand)]/4 blur-[100px] pointer-events-none" />
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors mb-6 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                {tc("back")}
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
                    <Sparkles className="w-3 h-3" />
                    {t("title")}
                  </span>
                  <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("title")}</h1>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{t("subtitle")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerStagger(0.06)}
          className="max-w-2xl mx-auto px-4 sm:px-6 pb-12 space-y-6"
        >
          {/* Change Password */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-4">
            <h2 className="font-semibold text-[var(--text)]">{t("updatePassword")}</h2>

            {passwordFeedback && (
              <div className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm",
                passwordFeedback.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                  : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30"
              )}>
                {passwordFeedback.type === "success"
                  ? <Check className="w-4 h-4 shrink-0" />
                  : <AlertCircle className="w-4 h-4 shrink-0" />
                }
                <span>{passwordFeedback.message}</span>
              </div>
            )}

            <Input
              label={t("currentPassword")}
              type={showPasswords.currentPassword ? "text" : "password"}
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              rightIcon={
                <button type="button" onClick={() => togglePasswordVisibility("currentPassword")} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                  {showPasswords.currentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Input
              label={t("newPassword")}
              type={showPasswords.newPassword ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              rightIcon={
                <button type="button" onClick={() => togglePasswordVisibility("newPassword")} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                  {showPasswords.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Input
              label={t("confirmPassword")}
              type={showPasswords.confirmPassword ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              rightIcon={
                <button type="button" onClick={() => togglePasswordVisibility("confirmPassword")} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                  {showPasswords.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <p className="text-xs text-[var(--text-tertiary)]">{t("passwordRequirements")}</p>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleUpdatePassword}
              disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
            >
              {t("updatePassword")}
            </Button>
          </motion.div>

          {/* Active Sessions */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[var(--text)]">{t("sessions")}</h2>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {MOCK_SESSIONS.map((session) => (
                <div key={session.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    session.isCurrent
                      ? "bg-[var(--brand-subtle)] text-[var(--brand-text)]"
                      : "bg-[var(--border-subtle)] text-[var(--text-secondary)]"
                  )}>
                    <session.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{session.device}</p>
                      {session.isCurrent && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                          {t("currentSession")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{session.browser} · {session.location}</p>
                    <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{timeAgo(session.lastActive)}</p>
                  </div>
                  {!session.isCurrent && (
                    <button className="text-xs font-medium text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors shrink-0 mt-1">
                      {tc("cancel")}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={handleRevokeAll}
                disabled={revoking}
                className="flex items-center gap-1.5 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors disabled:opacity-50"
              >
                <Globe className="w-4 h-4" />
                {t("revokeAll")}
              </button>
            </div>
          </motion.div>

          {/* Two-Factor Authentication */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[var(--brand-text)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{t("twoFactor")}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t("twoFactorDesc")}</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0",
                  twoFactorEnabled ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                  twoFactorEnabled ? "translate-x-5.5" : "translate-x-0.5"
                )} />
              </button>
            </div>
          </motion.div>

          {/* Login History */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-semibold text-[var(--text)]">{t("loginHistory")}</h2>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {MOCK_LOGIN_HISTORY.length > 0 ? (
                MOCK_LOGIN_HISTORY.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--border-subtle)] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{entry.device}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{entry.location} · {entry.ip}</p>
                      <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{timeAgo(entry.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center">
                  <Clock className="w-8 h-8 mx-auto text-[var(--text-tertiary)] mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">{t("noRecentActivity")}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
      <BottomNav />
    </>
  );
}
