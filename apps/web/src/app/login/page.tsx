"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerStagger, fadeUp } from "@/lib/motion";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    alert("Connexion simulée ! (Backend non connecté)");
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-[35dvh] bg-gradient-to-b from-[var(--brand)]/8 to-transparent pointer-events-none" />

      <header className="relative z-10 h-16 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center shadow-[var(--shadow-brand)] transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-black text-sm tracking-tight">UV</span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--text)] tracking-tight">Univibes</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
        <motion.div
          variants={containerStagger(0.07)}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-xs font-semibold text-[var(--brand-text)] tracking-wide">
              <Sparkles className="w-3 h-3" />
              Plateforme événementielle étudiante
            </span>
          </motion.div>

          {/* Logo mark */}
          <motion.div variants={fadeUp} className="text-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center mx-auto shadow-[var(--shadow-brand)]">
              <span className="text-white font-black text-3xl tracking-tight">UV</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
              Content de te revoir
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-64 mx-auto leading-relaxed">
              Connecte-toi pour découvrir les événements près de chez toi
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div>
                <Input
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ton mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                />
                <div className="flex justify-end mt-2">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-1"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion…
                  </span>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-[var(--text-tertiary)] bg-[var(--surface)]">
                  ou
                </span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button
                type="button"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                Facebook
              </button>
            </div>
          </motion.div>

          {/* Signup link */}
          <motion.div variants={fadeUp} className="mt-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-[var(--brand)] font-semibold hover:text-[var(--brand-hover)] transition-colors"
              >
                S&apos;inscrire
              </Link>
            </p>
          </motion.div>

          {/* Demo credentials */}
          <motion.div
            variants={fadeUp}
            className="mt-6 p-4 rounded-xl bg-[var(--brand-subtle)]/50 border border-[var(--brand)]/10"
          >
            <p className="text-[11px] font-semibold text-[var(--brand-text)] uppercase tracking-wider mb-1.5">
              Compte de démonstration
            </p>
            <p className="text-xs text-[var(--text-secondary)] font-mono">
              admin@univibes.com / Admin@Univibes2026!
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
