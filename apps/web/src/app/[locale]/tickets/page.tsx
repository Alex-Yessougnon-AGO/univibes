"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Ticket, Calendar, MapPin, QrCode, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { EVENTS } from "@/lib/mock-data";
import { formatFullDate, formatCurrency, cn } from "@/lib/utils";

const MOCK_TICKETS = [
  { id: "t1", event: EVENTS[1], quantity: 1, ticketName: "Participant", total: 0, date: "2025-03-15", status: "upcoming" as const, qrCode: "UNV-ABC123" },
  { id: "t2", event: EVENTS[6], quantity: 2, ticketName: "Étudiant", total: 3000, date: "2025-02-20", status: "upcoming" as const, qrCode: "UNV-DEF456" },
  { id: "t3", event: EVENTS[0], quantity: 1, ticketName: "VIP", total: 15000, date: "2025-01-10", status: "past" as const, qrCode: "UNV-GHI789" },
];

export default function TicketsPage() {
  const [viewQR, setViewQR] = useState<string | null>(null);

  const upcomingTickets = MOCK_TICKETS.filter((t) => t.status === "upcoming");
  const pastTickets = MOCK_TICKETS.filter((t) => t.status === "past");

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-8 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <Ticket className="w-3 h-3" />
                Billetterie
              </span>

              <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">
                Mes billets
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {MOCK_TICKETS.length} billet{MOCK_TICKETS.length !== 1 ? "s" : ""}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {/* Upcoming tickets */}
            {upcomingTickets.length > 0 && (
              <motion.div variants={fadeUp} className="mb-10">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  À venir
                </h2>
                <div className="space-y-4">
                  {upcomingTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)]"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-44 h-32 sm:h-auto shrink-0">
                          <Image src={ticket.event.coverImage} alt={ticket.event.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Badge variant="success" className="mb-2">Actif</Badge>
                              <h3 className="font-semibold text-[var(--text)]">{ticket.event.title}</h3>
                              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                {ticket.ticketName} · {ticket.quantity} billet{ticket.quantity > 1 ? "s" : ""}
                                {ticket.total > 0 && ` · ${formatCurrency(ticket.total)}`}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-secondary)]">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatFullDate(ticket.event.startDate)}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ticket.event.city}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setViewQR(ticket.id)}
                              className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--brand)] hover:border-[var(--brand)] transition-all shrink-0"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Past tickets */}
            {pastTickets.length > 0 && (
              <motion.div variants={fadeUp}>
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Passés</h2>
                <div className="space-y-3">
                  {pastTickets.map((ticket) => (
                    <div key={ticket.id} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 flex items-center gap-4 opacity-60 shadow-[var(--shadow-sm)]">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                        <Image src={ticket.event.coverImage} alt={ticket.event.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-[var(--text)]">{ticket.event.title}</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{formatFullDate(ticket.event.startDate)}</p>
                      </div>
                      <Badge variant="outline">Terminé</Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {MOCK_TICKETS.length === 0 && (
              <motion.div variants={fadeUp} className="text-center py-20">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1], delay: 0.1 }}
                  className="w-20 h-20 rounded-2xl bg-[var(--brand-subtle)] border border-[var(--brand)]/10 flex items-center justify-center mx-auto mb-5"
                >
                  <Ticket className="w-8 h-8 text-[var(--brand)]" />
                </motion.div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
                  Aucun billet pour le moment
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-7 max-w-sm mx-auto leading-relaxed">
                  Trouve un événement qui te fait envie et réserve ta place. Dès que ton achat est confirmé, ton billet apparaîtra ici, prêt à être utilisé.
                </p>
                <Button variant="primary" size="md" className="rounded-full px-6" asChild>
                  <Link href="/explore">Explorer les événements</Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </section>
      </main>

      {/* QR Code modal */}
      <AnimatePresence>
        {viewQR && (() => {
          const ticket = MOCK_TICKETS.find((t) => t.id === viewQR);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={() => setViewQR(null)}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
                className="relative w-80 p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center shadow-[var(--shadow-lg)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setViewQR(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-48 h-48 mx-auto mb-5 rounded-2xl bg-white p-4 flex items-center justify-center shadow-[var(--shadow-sm)]">
                  <div className="w-full h-full bg-[var(--text)] relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 grid grid-cols-8 gap-0.5 p-0.5">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className={`${Math.random() > 0.5 ? "bg-white" : "bg-transparent"} rounded-sm`} />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="font-semibold text-sm text-[var(--text)] font-mono tracking-wider">
                  {ticket?.qrCode}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                  Présente ce code à l&apos;entrée
                </p>

                <div className="mt-5 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs font-medium text-[var(--text)] truncate">{ticket?.event.title}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                    {ticket?.ticketName} · {ticket?.quantity} billet{ticket && ticket.quantity > 1 ? "s" : ""}
                  </p>
                </div>

                <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => setViewQR(null)}>
                  Fermer
                </Button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <BottomNav />
    </>
  );
}
