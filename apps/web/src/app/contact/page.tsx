"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, containerStagger } from "@/lib/motion";
import { Sparkles, Send, Mail, MessageSquare, HelpCircle, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";

const FAQ = [
  { q: "Comment créer un événement ?", a: "Inscris-toi en tant qu'organisateur, puis clique sur 'Créer un événement' depuis ton dashboard." },
  { q: "La billetterie est-elle payante ?", a: "Les événements gratuits sont sans commission. Les événements payants ont une commission de 5%." },
  { q: "Puis-je modifier un événement après publication ?", a: "Oui, tu peux modifier toutes les infos depuis ton dashboard même après publication." },
  { q: "Comment sont versés les paiements ?", a: "Les fonds sont reversés sur ton Mobile Money ou compte bancaire sous 48h." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-20 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial="hidden" animate="visible" variants={containerStagger(0.07)}>
              <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-6">
                <MessageSquare className="w-3 h-3" />
                Contact
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-[family-name:var(--font-display)] text-[var(--text)] leading-tight tracking-tight mb-4">
                On veut t&apos;entendre
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base text-[var(--text-secondary)] max-w-lg mx-auto">
                Une question, un bug, une idée ? Notre équipe est là pour toi.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]"
            >
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--text)] mb-1">Message envoyé !</h2>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">On te répond sous 24h à {form.email || "ton email"}.</p>
                  <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-semibold text-[var(--text)] mb-1">Envoie-nous un message</h2>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">Remplis le formulaire et on te répondra rapidement.</p>
                  <Input label="Nom complet" placeholder="Ton nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <Input label="Email" type="email" placeholder="ton@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <Input label="Sujet" placeholder="Ex: Question sur la billetterie" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Message</label>
                    <textarea
                      placeholder="Décris-nous ton problème ou ta question..."
                      className="w-full h-32 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button variant="primary" size="lg" className="w-full" type="submit">
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </Button>
                </form>
              )}
            </motion.div>

            {/* FAQ + Info */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-4 h-4 text-[var(--brand)]" />
                  <h3 className="font-semibold text-sm text-[var(--text)]">Questions fréquentes</h3>
                </div>
                <div className="space-y-2">
                  {FAQ.map((item) => (
                    <details key={item.q} className="group">
                      <summary className="flex items-center justify-between py-2 text-xs font-medium text-[var(--text)] cursor-pointer [&::-webkit-details-marker]:hidden">
                        {item.q}
                        <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)] group-open:rotate-90 transition-transform shrink-0" />
                      </summary>
                      <p className="text-xs text-[var(--text-secondary)] pb-2 pt-1">{item.a}</p>
                    </details>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] p-5 shadow-[var(--shadow)]"
              >
                <h3 className="font-semibold text-sm text-white mb-2">Tu veux devenir organisateur ?</h3>
                <p className="text-xs text-white/70 mb-4">Crée ton compte organisateur et publie ton premier événement en quelques minutes.</p>
                <Button variant="accent" size="sm" className="rounded-full" asChild>
                  <Link href="/register?role=organizer">Créer mon compte <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
