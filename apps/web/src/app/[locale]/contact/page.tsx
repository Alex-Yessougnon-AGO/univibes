"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Sparkles, Send, Mail, MessageSquare, HelpCircle, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";

export default function ContactPage() {
  const t = useTranslations();
  const FAQ = [
    { q: t("contact.faq1q"), a: t("contact.faq1a") },
    { q: t("contact.faq2q"), a: t("contact.faq2a") },
    { q: t("contact.faq3q"), a: t("contact.faq3a") },
    { q: t("contact.faq4q"), a: t("contact.faq4a") },
  ];
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
        <section className="relative pt-20 pb-12 overflow-hidden reveal">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 to-transparent pointer-events-none reveal card-hover" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center reveal card-hover">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-6 reveal card-hover">
                <MessageSquare className="w-3 h-3 reveal card-hover" />
                {t("contact.title")}
              </span>
              <h1 className="text-4xl sm:text-5xl font-[family-name:var(--font-display)] text-[var(--text)] leading-tight tracking-tight mb-4 reveal card-hover">
                {t("contact.title")}
              </h1>
              <p className="text-base text-[var(--text-secondary)] max-w-lg mx-auto reveal card-hover">
                {t("contact.subtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 reveal card-hover">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal card-hover">
            {/* Form */}
            <div
             
             
              className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] reveal card-hover"
            >
              {sent ? (
                <div className="text-center py-10 reveal card-hover">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 flex items-center justify-center mx-auto mb-4 reveal card-hover">
                    <Mail className="w-7 h-7 text-emerald-600 reveal card-hover" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--text)] mb-1 reveal card-hover">{t("contact.sent")}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mb-6 reveal card-hover">{t("contact.sentDesc")}</p>
                  <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                    {t("contact.send")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 reveal pressable card-hover">
                  <h2 className="font-semibold text-[var(--text)] mb-1 reveal pressable card-hover">{t("contact.title")}</h2>
                  <p className="text-xs text-[var(--text-secondary)] mb-4 reveal pressable card-hover">{t("contact.subtitle")}</p>
                  <Input label={t("contact.name")} placeholder="Ton nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <Input label={t("contact.email")} type="email" placeholder="ton@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <Input label={t("contact.subject")} placeholder="Ex: Question sur la billetterie" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5 reveal pressable card-hover">{t("contact.message")}</label>
                    <textarea
                      placeholder={t("contact.message")}
                      className="w-full h-32 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] resize-none reveal pressable card-hover"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button variant="primary" size="lg" className="w-full reveal pressable card-hover" type="submit">
                    <Send className="w-4 h-4 reveal pressable card-hover" />
                    {t("contact.send")}
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ + Info */}
            <div className="space-y-4 reveal pressable card-hover">
              <div
               
               
                className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] reveal pressable card-hover"
              >
                <div className="flex items-center gap-2 mb-4 reveal pressable card-hover">
                  <HelpCircle className="w-4 h-4 text-[var(--brand)] reveal pressable card-hover" />
                  <h3 className="font-semibold text-sm text-[var(--text)] reveal pressable card-hover">{t("contact.faq")}</h3>
                </div>
                <div className="space-y-2 reveal pressable card-hover">
                  {FAQ.map((item) => (
                    <details key={item.q} className="group reveal pressable card-hover">
                      <summary className="flex items-center justify-between py-2 text-xs font-medium text-[var(--text)] cursor-pointer [&::-webkit-details-marker]:hidden reveal pressable card-hover">
                        {item.q}
                        <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)] group-open:rotate-90 transition-transform shrink-0 reveal pressable card-hover" />
                      </summary>
                      <p className="text-xs text-[var(--text-secondary)] pb-2 pt-1 reveal pressable card-hover">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>

              <div
               
               
               
                className="rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] p-5 shadow-[var(--shadow)] reveal pressable card-hover"
              >
                <h3 className="font-semibold text-sm text-white mb-2 reveal pressable card-hover">{t("contact.faq")}</h3>
                <p className="text-xs text-white/70 mb-4 reveal pressable card-hover">{t("contact.subtitle")}</p>
                <Button variant="accent" size="sm" className="rounded-full reveal pressable card-hover" asChild>
                  <Link href="/register?role=organizer">{t("nav.register")} <ArrowRight className="w-3 h-3 reveal pressable card-hover" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
