"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Calendar, MapPin, QrCode, Download, Share2, Sparkles, X } from "lucide-react";
import { CategoryIcon } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { EVENTS } from "@/lib/mock-data";
import { formatFullDate, formatCurrency, cn } from "@/lib/utils";

const MOCK_TICKETS = [
  { id: "t1", event: EVENTS[1], quantity: 1, ticketName: "Participant", total: 0, date: "2025-03-15", status: "upcoming" as const, qrCode: "UNV-ABC123" },
  { id: "t2", event: EVENTS[6], quantity: 2, ticketName: "Étudiant", total: 3000, date: "2025-02-20", status: "upcoming" as const, qrCode: "UNV-DEF456" },
];

export default function TicketDetailPage() {
  const params = useParams();
  const ticket = MOCK_TICKETS.find((t) => t.id === params.id);
  const [showQR, setShowQR] = useState(false);

  if (!ticket) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg)]">
        <h2 className="font-semibold text-[var(--text)]">Billet introuvable</h2>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/tickets">Voir mes billets</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28 md:pb-0">
        <div className="relative pt-6 pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-emerald-500/3 to-transparent pointer-events-none" />

          <div className="relative max-w-lg mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            >
              <Link href="/tickets" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors mb-6 group">
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                Retour
              </Link>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-sm)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-emerald-600"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
                </div>
                <Badge variant="success" className="mb-3">Actif</Badge>
                <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">
                  {ticket.event.title}
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  {ticket.ticketName} · {ticket.quantity} billet{ticket.quantity > 1 ? "s" : ""}
                </p>
              </div>
            </motion.div>

            {/* Ticket card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
              className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={ticket.event.coverImage} alt={ticket.event.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
                    <CategoryIcon name={ticket.event.category.icon} className="w-3 h-3 mr-1" /> {ticket.event.category.name}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Calendar className="w-3.5 h-3.5 text-[var(--brand)]" />
                      <span>{formatFullDate(ticket.event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
                      <span>{ticket.event.location}, {ticket.event.city}</span>
                    </div>
                  </div>
                  {ticket.total > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-tertiary)]">Payé</p>
                      <p className="text-lg font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">{formatCurrency(ticket.total)}</p>
                    </div>
                  )}
                </div>

                {/* Divider with circles */}
                <div className="relative">
                  <div className="absolute -left-7 -top-2 w-5 h-5 rounded-full bg-[var(--bg)] border border-[var(--border)]" />
                  <div className="border-t-2 border-dashed border-[var(--border)]" />
                  <div className="absolute -right-7 -top-2 w-5 h-5 rounded-full bg-[var(--bg)] border border-[var(--border)]" />
                </div>

                {/* QR Code section */}
                <div className="text-center">
                  <div
                    className="w-32 h-32 mx-auto mb-3 rounded-xl bg-white p-3 cursor-pointer hover:shadow-[var(--shadow-md)] transition-shadow"
                    onClick={() => setShowQR(true)}
                  >
                    <div className="w-full h-full bg-[var(--text)] relative overflow-hidden rounded-lg">
                      <div className="absolute inset-0 grid grid-cols-8 gap-0.5 p-0.5">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className={`${Math.random() > 0.5 ? "bg-white" : "bg-transparent"} rounded-sm`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-mono font-semibold text-[var(--text)] tracking-wider">{ticket.qrCode}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-1">Tape pour agrandir</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    Partager
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Event info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.1, 0, 1] }}
              className="mt-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[var(--brand)]/15 shrink-0">
                  <Image src={ticket.event.organizer.logoUrl} alt={ticket.event.organizer.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">{ticket.event.organizer.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{ticket.event.organizer.description}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* QR modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
              className="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-56 h-56 mx-auto mb-4 rounded-xl bg-white p-4 shadow-[var(--shadow)]">
                <div className="w-full h-full bg-[var(--text)] relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 grid grid-cols-8 gap-0.5 p-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`${Math.random() > 0.5 ? "bg-white" : "bg-transparent"} rounded-sm`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-semibold text-lg text-gray-900 font-mono tracking-wider">{ticket.qrCode}</p>
              <p className="text-sm text-gray-500 mt-1">Présente ce code à l&apos;entrée</p>
              <button
                onClick={() => setShowQR(false)}
                className="mt-6 px-6 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </>
  );
}
