"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { fadeUp, containerStagger } from "@/lib/motion";
import { Sparkles, ArrowRight, Users, Calendar, Heart, Shield, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

const VALUES = [
  { icon: Users, title: "Communauté", desc: "UnivVibes rassemble les étudiants autour des événements qui font vivre le campus." },
  { icon: Lightbulb, title: "Innovation", desc: "Nous digitalisons la découverte et la gestion des événements universitaires." },
  { icon: Target, title: "Accessibilité", desc: "Gratuit pour les étudiants, simple pour les organisateurs." },
  { icon: Heart, title: "Passion", desc: "Chaque événement est une occasion de créer des moments mémorables." },
  { icon: Shield, title: "Confiance", desc: "Organisateurs vérifiés, paiements sécurisés, données protégées." },
  { icon: Calendar, title: "Exhaustivité", desc: "Tous les événements étudiants au Bénin, centralisés en un seul endroit." },
];

export default function AboutPage() {
  const t = useTranslations();
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Hero */}
        <section className="relative pt-20 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial="hidden" animate="visible" variants={containerStagger(0.07)}>
              <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-6">
                <Sparkles className="w-3 h-3" />
                {t("about.title")}
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-[family-name:var(--font-display)] text-[var(--text)] leading-tight tracking-tight mb-6 text-balance">
                Le hub qui connecte<br />
                <span className="text-gradient-brand">la vie étudiante</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-8">
                {t("about.missionText")}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] p-10 md:p-14 text-center text-white"
            >
              <Target className="w-10 h-10 text-[var(--accent)] mx-auto mb-5" />
              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] mb-4">{t("about.mission")}</h2>
              <p className="text-white/80 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
                {t("about.missionText")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--brand-subtle)] text-[var(--brand-text)] text-[10px] font-semibold uppercase tracking-[0.15em] mb-4">{t("about.mission")}</span>
                <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] text-[var(--text)] leading-tight mb-4">
                  Né d&apos;un constat simple
                </h2>
                <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <p>
                    En 2025, nous avons réalisé que les étudiants béninois découvraient les événements
                    via WhatsApp, Facebook et Instagram — des infos dispersées, souvent perdues dans le fil.
                  </p>
                  <p>
                    Pas de site centralisé, pas de billetterie en ligne, pas de moyen simple pour les
                    associations de toucher leur public. UnivVibes est né pour résoudre ce problème.
                  </p>
                  <p>
                    Aujourd&apos;hui, nous travaillons avec les universités et associations pour faire de
                    chaque campus un lieu de vie connecté.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 border border-[var(--border)]"
              >
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center mx-auto mb-5 shadow-xl">
                      <span className="text-white font-black text-5xl tracking-tight">UV</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">2025 · Cotonou, Bénin</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-20 bg-[var(--border-subtle)]/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--brand-subtle)] text-[var(--brand-text)] text-[10px] font-semibold uppercase tracking-[0.15em] mb-4">{t("about.values")}</span>
              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] text-[var(--text)]">{t("about.values")}</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand)]/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-[var(--brand)]" />
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--text)] mb-1.5">{v.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
                <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] text-[var(--text)] mb-4">
                {t("home.discoverEvents")}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                {t("about.missionText")}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button variant="primary" size="lg" className="rounded-full px-8" asChild>
                  <Link href="/register">{t("nav.register")} <ArrowRight className="w-4 h-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                  <Link href="/contact">{t("pricing.ctaContact")}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
