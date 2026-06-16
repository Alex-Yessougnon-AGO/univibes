"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, containerStagger } from "@/lib/motion";
import { Sparkles, Check, ArrowRight, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Gratuit",
    price: "0",
    period: "toujours",
    desc: "Pour les associations qui débutent",
    features: [
      "Événements illimités",
      "Jusqu'à 100 participants par événement",
      "Statistiques de base (vues, favoris)",
      "Badge organisateur vérifié",
      "Support par email",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Premium",
    price: "10 000",
    period: "/ mois",
    desc: "Pour les associations qui veulent passer à la vitesse supérieure",
    features: [
      "Tout du plan Gratuit",
      "Participants illimités",
      "Statistiques avancées + graphiques",
      "Boosts d'événements inclus (1/semaine)",
      "Billetterie payante (commission 3%)",
      "Export CSV des participants",
      "Support prioritaire",
      "Badge Premium",
    ],
    cta: "Passer en Premium",
    popular: true,
  },
  {
    name: "Sponsor",
    price: "Sur mesure",
    period: "",
    desc: "Pour les entreprises et marques qui veulent sponsoriser des événements",
    features: [
      "Visibilité sur la page d'accueil",
      "Bannières publicitaires dédiées",
      "Ciblage par ville et université",
      "Rapport d'impact mensuel",
      "Accès API (Phase 2)",
      "Accompagnement dédié",
      "Facture personnalisée",
    ],
    cta: "Nous contacter",
    popular: false,
  },
];

const FAQ = [
  { q: "La billetterie est-elle gratuite ?", a: "Le plan Gratuit permet de créer des événements gratuits sans commission. Pour vendre des billets, le plan Premium applique une commission de 3%." },
  { q: "Puis-je passer de Gratuit à Premium à tout moment ?", a: "Oui, l'upgrade est instantané et tu conserves tous tes événements et données." },
  { q: "Comment sont reversés les paiements ?", a: "Les revenus de la billetterie sont versés sur ton compte Mobile Money (MTN, Moov) ou bancaire sous 48h." },
  { q: "Y a-t-il un engagement de durée ?", a: "Non. Le plan Premium est mensuel et résiliable à tout moment." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-20 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial="hidden" animate="visible" variants={containerStagger(0.07)}>
              <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-6">
                <Sparkles className="w-3 h-3" />
                Tarifs
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-[family-name:var(--font-display)] text-[var(--text)] leading-tight tracking-tight mb-4">
                Des tarifs pour chaque association
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
                    Commence gratuitement et passe en Premium quand tu es prêt à développer tes événements.
                  </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={cn(
                  "relative rounded-2xl p-6 border shadow-[var(--shadow)] flex flex-col",
                  plan.popular
                    ? "bg-[var(--surface)] border-[var(--brand)]/30 ring-1 ring-[var(--brand)]/20"
                    : "bg-[var(--surface)] border-[var(--border)]"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--brand-hover)] text-white text-[10px] font-bold uppercase tracking-wider shadow-[var(--shadow-brand)]">
                    Le plus populaire
                  </span>
                )}

                <div className="mb-6">
                  <h2 className="font-semibold text-lg text-[var(--text)]">{plan.name}</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-[var(--text)] font-[family-name:var(--font-display)]">{plan.price}</span>
                  {plan.period && <span className="text-sm text-[var(--text-secondary)] ml-1">{plan.period}</span>}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                      <Check className="w-4 h-4 text-[var(--brand)] shrink-0 mt-px" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  size="md"
                  className="w-full"
                  asChild
                >
                  <Link href={plan.name === "Sponsor" ? "/contact" : "/register?role=organizer"}>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[var(--border-subtle)]/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] text-center mb-8">Questions fréquentes</h2>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-medium text-[var(--text)] hover:bg-[var(--border-subtle)] transition-colors [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] group-open:rotate-90 transition-transform shrink-0 ml-2" />
                  </summary>
                  <div className="px-5 pb-5 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
