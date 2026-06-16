"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cookie, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
              <Cookie className="w-3 h-3" />
              Cookies
            </span>
            <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">Politique de cookies</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8">Dernière mise à jour : juin 2025</p>

            <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-[var(--text)] mb-3">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
                <p>Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. Il permet au site de mémoriser vos préférences et d&apos;améliorer votre expérience de navigation.</p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-[var(--text)] mb-3">2. Cookies utilisés</h2>
                <p>Nous utilisons des cookies essentiels au fonctionnement de la plateforme (authentification, session) et des cookies analytiques (pour comprendre comment vous utilisez le site). Nous n&apos;utilisons pas de cookies publicitaires tiers.</p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-[var(--text)] mb-3">3. Gestion des cookies</h2>
                <p>Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, certaines fonctionnalités de la plateforme pourraient ne pas fonctionner correctement sans eux.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
