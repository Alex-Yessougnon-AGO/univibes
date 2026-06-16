"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { fadeUp, containerStagger } from "@/lib/motion";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <motion.div variants={containerStagger(0.08)} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <ScrollText className="w-3 h-3" />
                Légal
              </span>
              <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">Conditions d&apos;utilisation</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8">Dernière mise à jour : juin 2025</p>
            </motion.div>

            <div className="prose prose-sm max-w-none space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
              {[
                { title: "1. Acceptation des conditions", text: "En accédant à la plateforme Univibes, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services." },
                { title: "2. Description du service", text: "Univibes est une plateforme de découverte et de gestion d'événements étudiants. Elle permet aux utilisateurs de découvrir des événements, aux organisateurs de créer et promouvoir leurs événements, et facilite la billetterie en ligne." },
                { title: "3. Comptes utilisateurs", text: "Vous êtes responsable de la confidentialité de votre compte et mot de passe. Vous devez fournir des informations exactes et à jour lors de l'inscription. Univibes se réserve le droit de suspendre tout compte en cas de violation des présentes conditions." },
                { title: "4. Organisateurs et événements", text: "Les organisateurs sont seuls responsables du contenu et de la légalité de leurs événements. Univibes agit comme intermédiaire technique et ne peut être tenu responsable des événements publiés sur la plateforme." },
                { title: "5. Billetterie et paiements", text: "Les transactions sont sécurisées via nos partenaires de paiement. Univibes prélève une commission sur les ventes de billets, conformément aux tarifs en vigueur. Les remboursements sont gérés directement par les organisateurs." },
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
