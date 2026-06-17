"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { fadeUp, containerStagger } from "@/lib/motion";

export default function PrivacyPage() {
  const t = useTranslations();
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <motion.div variants={containerStagger(0.08)} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <Shield className="w-3 h-3" />
                Confidentialité
              </span>
              <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">Politique de confidentialité</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8">Dernière mise à jour : juin 2025</p>
            </motion.div>

            <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
              {[
                { title: "1. Données collectées", text: "Nous collectons les informations que vous nous fournissez lors de l'inscription : nom, email, université, numéro de téléphone. Nous collectons également des données d'utilisation (pages visitées, événements consultés) pour améliorer nos services." },
                { title: "2. Utilisation des données", text: "Vos données sont utilisées pour : vous fournir nos services, personnaliser votre expérience, vous envoyer des notifications pertinentes, et améliorer notre plateforme. Nous ne vendons jamais vos données personnelles." },
                { title: "3. Protection des données", text: "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, modification ou destruction." },
                { title: "4. Vos droits", text: "Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à privacy@univibes.com." },
              ].map((section, i) => (
                <motion.section
                  key={section.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
                >
                  <h2 className="text-lg font-semibold text-[var(--text)] mb-3">{section.title}</h2>
                  <p>{section.text}</p>
                </motion.section>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
