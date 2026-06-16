"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
              <Shield className="w-3 h-3" />
              Confidentialité
            </span>
            <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">Politique de confidentialité</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8">Dernière mise à jour : juin 2025</p>

            <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-[var(--text)] mb-3">1. Données collectées</h2>
                <p>Nous collectons les informations que vous nous fournissez lors de l&apos;inscription : nom, email, université, numéro de téléphone. Nous collectons également des données d&apos;utilisation (pages visitées, événements consultés) pour améliorer nos services.</p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-[var(--text)] mb-3">2. Utilisation des données</h2>
                <p>Vos données sont utilisées pour : vous fournir nos services, personnaliser votre expérience, vous envoyer des notifications pertinentes, et améliorer notre plateforme. Nous ne vendons jamais vos données personnelles.</p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-[var(--text)] mb-3">3. Protection des données</h2>
                <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, modification ou destruction.</p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-[var(--text)] mb-3">4. Vos droits</h2>
                <p>Conformément à la réglementation, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à privacy@univibes.com.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
