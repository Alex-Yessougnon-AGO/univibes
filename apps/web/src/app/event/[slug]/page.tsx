"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { ViewTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer as stagger } from "@/lib/motion";
import {
  Calendar,
  MapPin,
  Clock,
  Eye,
  Heart,
  Share2,
  ChevronLeft,
  Check,
  Users,
  ArrowRight,
  Sparkles,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { CategoryIcon } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { EVENTS } from "@/lib/mock-data";
import { formatFullDate, formatTime, formatCurrency, cn } from "@/lib/utils";
import type { MockTicketType } from "@/lib/mock-data";

export default function EventDetailPage() {
  const params = useParams();
  const event = EVENTS.find((e) => e.slug === params.slug);
  const [favorited, setFavorited] = useState(event?.isFavorited ?? false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);

  if (!event) notFound();

  const relatedEvents = EVENTS.filter(
    (e) => e.category.id === event.category.id && e.id !== event.id
  ).slice(0, 4);

  const handleBuyTicket = () => {
    if (!selectedTicket) return;
    setShowBuyModal(false);
    setSelectedTicket(null);
    setTicketQuantity(1);
  };

  const totalTicketsRemaining = event.tickets?.reduce((sum, t) => sum + t.remaining, 0) ?? 0;

  return (
    <>
      {/* Top navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/explore" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Retour
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFavorited(!favorited)}
              className={cn(
                "w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200",
                favorited
                  ? "border-red-200 bg-red-50 dark:bg-red-950/20 text-red-500"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-200"
              )}
              aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={cn("w-4 h-4 transition-all", favorited && "fill-red-500 scale-110")} />
            </button>
            <button className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)] transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>
      <div className="h-14" />

      <main className="flex-1 pb-28 md:pb-0">
        {/* Cover image with gradient overlay */}
        <section className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] overflow-hidden">
          <ViewTransition name={`event-${event.slug}`} share="morph">
            <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority />
          </ViewTransition>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/10 to-transparent" />
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-8 relative"
          >
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & meta */}
              <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Badge variant="soft" className="mb-3">
                      <CategoryIcon name={event.category.icon} className="w-3.5 h-3.5 mr-1" />
                      {event.category.name}
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] text-[var(--text)] leading-tight tracking-tight">
                      {event.title}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-6 text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Calendar className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span>{formatFullDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Clock className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span>{formatTime(event.startDate)} — {formatTime(event.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <MapPin className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span className="truncate">{event.location}, {event.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Eye className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span>{event.views.toLocaleString()} vues</span>
                  </div>
                </div>

                {event.university && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                    <Badge variant="outline" className="gap-1.5">
                      <Users className="w-3 h-3" />
                      {event.university}
                    </Badge>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)]">
                <h2 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  À propos de l&apos;événement
                </h2>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="px-3 py-1">{tag}</Badge>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Tickets */}
              {event.tickets && event.tickets.length > 0 && (
                <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)]" id="tickets">
                  <h2 className="font-semibold text-[var(--text)] mb-4">Billets disponibles</h2>
                  <div className="space-y-3">
                    {event.tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => { setSelectedTicket(ticket.id); setShowBuyModal(true); }}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-[var(--brand)]/30 hover:bg-[var(--brand-subtle)]/30 transition-all duration-200 text-left group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-[var(--text)]">{ticket.name}</h3>
                            {ticket.description && (
                              <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">{ticket.description}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className={cn(
                              "font-bold text-base",
                              ticket.price === 0 ? "text-[var(--success)]" : "text-[var(--brand)]"
                            )}>
                              {ticket.price === 0 ? "Gratuit" : formatCurrency(ticket.price)}
                            </span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                              <span className={cn(
                                "font-medium",
                                ticket.remaining < 10 ? "text-[var(--error)]" : ticket.remaining < 30 ? "text-[var(--warning)]" : ""
                              )}>
                                {ticket.remaining}
                              </span> / {ticket.total} restants
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-4">
                          <div className="w-9 h-9 rounded-full border border-[var(--border)] group-hover:border-[var(--brand)] flex items-center justify-center group-hover:bg-[var(--brand)] group-hover:text-white transition-all duration-200">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Organizer */}
              <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)]">
                <h2 className="font-semibold text-[var(--text)] mb-4">Organisateur</h2>
                <Link href={`/organizer/${event.organizer.slug}`} className="flex items-center gap-4 group">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-[var(--brand)]/20 group-hover:ring-[var(--brand)]/40 transition-all">
                    <Image src={event.organizer.logoUrl} alt={event.organizer.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                        {event.organizer.name}
                      </h3>
                      {event.organizer.verified && (
                        <span className="w-4 h-4 rounded-full bg-[var(--brand)] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {event.organizer.followersCount.toLocaleString()} abonnés · {event.organizer.eventsCount} événements
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-1">
                      {event.organizer.description}
                    </p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[var(--text-tertiary)] -rotate-180 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                {/* Price card */}
                <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
                  <div className="text-center">
                    <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1.5">
                      À partir de
                    </p>
                    <p className={cn(
                      "text-3xl font-extrabold font-[family-name:var(--font-display)]",
                      event.isFree ? "text-[var(--success)]" : "text-[var(--brand)]"
                    )}>
                      {event.isFree ? "Gratuit" : formatCurrency(event.lowestPrice ?? 0)}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                      {totalTicketsRemaining} billet{totalTicketsRemaining !== 1 ? "s" : ""} restant{totalTicketsRemaining !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (event.tickets && event.tickets.length > 0) {
                          setSelectedTicket(event.tickets[0].id);
                          setShowBuyModal(true);
                        }
                      }}
                    >
                      Réserver maintenant
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full"
                      onClick={() => setFavorited(!favorited)}
                    >
                      <Heart className={cn("w-4 h-4", favorited && "fill-red-500 text-red-500")} />
                      {favorited ? "Favori" : "Ajouter aux favoris"}
                    </Button>
                  </div>
                </motion.div>

                {/* Date & Location card */}
                <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-[var(--brand)]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text)]">{formatFullDate(event.startDate)}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {formatTime(event.startDate)} — {formatTime(event.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[var(--brand)]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text)]">{event.location}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{event.city}</p>
                      {event.university && (
                        <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{event.university}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="py-16"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">
                  Événements similaires
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedEvents.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0, 1] }}
                  >
                    <Link href={`/event/${e.slug}`} className="group card-base overflow-hidden card-hover block">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={e.coverImage}
                          alt={e.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="soft" className="bg-white/90 dark:bg-black/60 text-xs backdrop-blur-sm">{e.category.name}</Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-[var(--text)] line-clamp-2 leading-snug">{e.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Calendar className="w-3 h-3 text-[var(--text-tertiary)] shrink-0" />
                          <p className="text-xs text-[var(--text-secondary)]">{formatFullDate(e.startDate)}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      {/* Sticky bottom CTA — mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-[var(--border)] p-3 safe-area-pb">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">À partir de</p>
            <p className={cn("font-bold text-lg font-[family-name:var(--font-display)]", event.isFree ? "text-[var(--success)]" : "text-[var(--brand)]")}>
              {event.isFree ? "Gratuit" : formatCurrency(event.lowestPrice ?? 0)}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="rounded-full px-6"
            onClick={() => {
              if (event.tickets && event.tickets.length > 0) {
                setSelectedTicket(event.tickets[0].id);
                setShowBuyModal(true);
              }
            }}
          >
            Réserver
          </Button>
        </div>
      </div>

      {/* Buy ticket modal */}
      <AnimatePresence>
        {showBuyModal && selectedTicket && (() => {
          const ticket = event.tickets?.find((t) => t.id === selectedTicket);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
              onClick={() => setShowBuyModal(false)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
                className="relative w-full md:max-w-md rounded-t-3xl md:rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow-lg)] md:m-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--text)]">Réserver un billet</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{event.title}</p>
                  </div>
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Ticket type selection */}
                <div className="space-y-2.5">
                  {event.tickets?.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTicket(t.id); setTicketQuantity(1); }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        selectedTicket === t.id
                          ? "border-[var(--brand)] bg-[var(--brand-subtle)]"
                          : "border-[var(--border)] hover:border-[var(--brand)]/30"
                      )}
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-[var(--text)]">{t.name}</h4>
                        {t.description && (
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t.description}</p>
                        )}
                        <p className={cn(
                          "text-xs mt-1",
                          t.remaining < 10 ? "text-[var(--error)]" : "text-[var(--text-tertiary)]"
                        )}>
                          {t.remaining} / {t.total} restants
                        </p>
                      </div>
                      <span className={cn("font-bold text-base", t.price === 0 ? "text-[var(--success)]" : "text-[var(--brand)]")}>
                        {t.price === 0 ? "Gratuit" : formatCurrency(t.price)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quantity & total */}
                {ticket && (
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--border-subtle)]">
                      <span className="text-sm font-medium text-[var(--text)]">Quantité</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                          disabled={ticketQuantity <= 1}
                          className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-sm font-medium disabled:opacity-40 hover:bg-[var(--border-subtle)] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold text-[var(--text)] tabular-nums">{ticketQuantity}</span>
                        <button
                          onClick={() => {
                            if (ticketQuantity < ticket.remaining) setTicketQuantity(ticketQuantity + 1);
                          }}
                          disabled={ticketQuantity >= ticket.remaining}
                          className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-sm font-medium disabled:opacity-40 hover:bg-[var(--border-subtle)] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-[var(--text)] font-medium">Total</span>
                      <span className="text-xl font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">
                        {formatCurrency(ticket.price * ticketQuantity)}
                      </span>
                    </div>

                    <Button variant="primary" size="lg" className="w-full" onClick={handleBuyTicket}>
                      Confirmer la réservation
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <BottomNav />
    </>
  );
}
