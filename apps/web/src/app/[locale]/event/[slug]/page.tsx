"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
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
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { formatFullDate, formatTime, formatCurrency, cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { eventsService } from "@/lib/services/events-service";

export default function EventDetailPage() {
  const params = useParams();
  const t = useTranslations();
  useScrollReveal();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    const slug = params.slug as string;
    if (!slug) return;
    eventsService.findBySlug(slug)
      .then((data) => {
        setEvent(data);
        setFavorited((data as any)?.isFavorited ?? false);
      })
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)]">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--brand)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!event) notFound();

  const relatedEvents: any[] = [];

  const handleBuyTicket = () => {
    if (!selectedTicket) return;
    setShowBuyModal(false);
    setSelectedTicket(null);
    setTicketQuantity(1);
  };

  const totalTicketsRemaining = event.tickets?.reduce((sum: number, ti: any) => sum + ti.remaining, 0) ?? 0;

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28 md:pb-0">
        {/* ── Cover image ── */}
        <section className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] overflow-hidden reveal">
          <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/10 to-transparent" />
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-8 relative">
            {/* ── Main content ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & meta */}
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)] reveal card-hover">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-xs font-medium text-[var(--brand-text)] mb-3">
                      <CategoryIcon name={event.category.icon} className="w-3.5 h-3.5" />
                      {event.category.name}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] text-[var(--text)] leading-tight tracking-tight">
                      {event.title}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-6 text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Calendar className="w-4 h-4 text-[var(--brand)] shrink-0" aria-hidden="true" />
                    <span>{formatFullDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Clock className="w-4 h-4 text-[var(--brand)] shrink-0" aria-hidden="true" />
                    <span>{formatTime(event.startDate)} — {formatTime(event.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <MapPin className="w-4 h-4 text-[var(--brand)] shrink-0" aria-hidden="true" />
                    <span className="truncate">{event.location}, {event.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Eye className="w-4 h-4 text-[var(--brand)] shrink-0" aria-hidden="true" />
                    <span>{event.views.toLocaleString()} {t("event.views")}</span>
                  </div>
                </div>

                {event.university && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)]">
                      <Users className="w-3 h-3" aria-hidden="true" />
                      {event.university}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)] reveal card-hover">
                <h2 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                  {t("event.about")}
                </h2>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    {event.tags.map((tag: string) => (
                      <span key={tag} className="inline-flex px-3 py-1 rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tickets */}
              {event.tickets && event.tickets.length > 0 && (
                <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)] reveal card-hover" id="tickets">
                  <h2 className="font-semibold text-[var(--text)] mb-4">{t("event.availableTickets")}</h2>
                  <div className="space-y-3">
                    {event.tickets.map((tkt: any) => (
                      <button
                        key={tkt.id}
                        onClick={() => { setSelectedTicket(tkt.id); setShowBuyModal(true); }}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-[var(--brand)]/30 hover:bg-[var(--brand-subtle)]/30 transition-all duration-200 text-left group pressable"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-[var(--text)]">{tkt.name}</h3>
                            {tkt.description && (
                              <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">{tkt.description}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className={cn(
                              "font-bold text-base",
                              tkt.price === 0 ? "text-[var(--success)]" : "text-[var(--brand)]"
                            )}>
                              {tkt.price === 0 ? t("event.free") : formatCurrency(tkt.price)}
                            </span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                              <span className={cn(
                                "font-medium",
                                tkt.remaining < 10 ? "text-[var(--error)]" : tkt.remaining < 30 ? "text-[var(--warning)]" : ""
                              )}>
                                {tkt.remaining}
                              </span> / {tkt.total} {t("event.remaining")}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-4">
                          <div className="w-9 h-9 rounded-full border border-[var(--border)] group-hover:border-[var(--brand)] flex items-center justify-center group-hover:bg-[var(--brand)] group-hover:text-white transition-all duration-200">
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer */}
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow)] reveal card-hover">
                <h2 className="font-semibold text-[var(--text)] mb-4">{t("event.organizer")}</h2>
                <Link href={`/organizer/${event.organizer.slug}`} className="flex items-center gap-4 group">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-[var(--brand)]/20 group-hover:ring-[var(--brand)]/40 transition-all shrink-0">
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
                      {t("event.followersCount", { count: event.organizer.followersCount })} · {t("event.eventsCount", { count: event.organizer.eventsCount })}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-1">
                      {event.organizer.description}
                    </p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[var(--text-tertiary)] -rotate-180 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price + CTA */}
                <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] reveal card-hover">
                  <div className="text-center">
                    <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold mb-1.5">
                      {t("event.from")}
                    </p>
                    <p className={cn(
                      "text-3xl font-extrabold font-[family-name:var(--font-display)]",
                      event.isFree ? "text-[var(--success)]" : "text-[var(--brand)]"
                    )}>
                      {event.isFree ? t("event.free") : formatCurrency(event.lowestPrice ?? 0)}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                      {t("event.ticketsRemaining", { count: totalTicketsRemaining })}
                    </p>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full pressable"
                      onClick={() => {
                        if (event.tickets && event.tickets.length > 0) {
                          setSelectedTicket(event.tickets[0].id);
                          setShowBuyModal(true);
                        }
                      }}
                    >
                      {t("event.bookNow")}
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full pressable"
                      onClick={() => setFavorited(!favorited)}
                    >
                      <Heart className={cn("w-4 h-4", favorited && "fill-red-500 text-red-500")} />
                      {favorited ? t("event.favorite") : t("event.addFavorite")}
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                    <button className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors pressable">
                      <Share2 className="w-3.5 h-3.5" />
                      {t("event.share")}
                    </button>
                  </div>
                </div>

                {/* Date & Location */}
                <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] space-y-4 reveal card-hover">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center shrink-0 card-hover">
                      <Calendar className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text)]">{formatFullDate(event.startDate)}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {formatTime(event.startDate)} — {formatTime(event.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center shrink-0 card-hover">
                      <MapPin className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text)]">{event.location}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{event.city}</p>
                      {event.university && (
                        <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{event.university}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Favorites + shares count */}
                <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] reveal card-hover">
                  <div className="flex items-center justify-around text-center">
                    <div>
                      <p className="font-bold text-lg text-[var(--text)] font-[family-name:var(--font-display)]">{event.favoritesCount.toLocaleString()}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{t("event.favorites")}</p>
                    </div>
                    <div className="w-px h-10 bg-[var(--border)]" />
                    <div>
                      <p className="font-bold text-lg text-[var(--text)] font-[family-name:var(--font-display)]">{event.views.toLocaleString()}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{t("event.views")}</p>
                    </div>
                    <div className="w-px h-10 bg-[var(--border)]" />
                    <div>
                      <p className="font-bold text-lg text-[var(--text)] font-[family-name:var(--font-display)]">{totalTicketsRemaining}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{t("event.remaining")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related events ── */}
          {relatedEvents.length > 0 && (
            <section className="py-16 reveal">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                <h2 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">
                  {t("event.relatedEvents")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedEvents.map((e: any, i: number) => (
                  <div key={e.id} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                    <Link href={`/event/${e.slug}`} className="group card-base overflow-hidden card-hover block">
                      <div className="relative aspect-[4/3] overflow-hidden img-zoom">
                        <Image
                          src={e.coverImage}
                          alt={e.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/60 text-[10px] font-semibold text-[var(--text-secondary)] backdrop-blur-sm">
                            {e.category.name}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-[var(--text)] line-clamp-2 leading-snug group-hover:text-[var(--brand)] transition-colors">{e.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Calendar className="w-3 h-3 text-[var(--text-tertiary)] shrink-0" aria-hidden="true" />
                          <p className="text-xs text-[var(--text-secondary)]">{formatFullDate(e.startDate)}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ── Sticky bottom CTA — mobile ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--surface)] border-t border-[var(--border)] p-3 safe-area-pb shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">{t("event.from")}</p>
            <p className={cn("font-bold text-lg font-[family-name:var(--font-display)]", event.isFree ? "text-[var(--success)]" : "text-[var(--brand)]")}>
              {event.isFree ? t("event.free") : formatCurrency(event.lowestPrice ?? 0)}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="rounded-full px-6 pressable"
            onClick={() => {
              if (event.tickets && event.tickets.length > 0) {
                setSelectedTicket(event.tickets[0].id);
                setShowBuyModal(true);
              }
            }}
          >
            {t("event.book")}
          </Button>
        </div>
      </div>

      {/* ── Buy ticket modal — CSS-only ── */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-end md:items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0,1)]",
          showBuyModal ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!showBuyModal}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            showBuyModal ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setShowBuyModal(false)}
        />
        {selectedTicket && (() => {            const ticket = event.tickets?.find((ti: any) => ti.id === selectedTicket);
          return (
            <div
              className={cn(
                "relative w-full md:max-w-md rounded-t-3xl md:rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 shadow-[var(--shadow-lg)] md:m-4 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0,1)] max-h-[88dvh] overflow-y-auto",
                showBuyModal ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 md:translate-y-4"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-[var(--text)]">{t("event.bookTicket")}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{event.title}</p>
                </div>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] transition-colors pressable"
                  aria-label={t("common.close")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Ticket type selection */}
              <div className="space-y-2.5">
                {event.tickets?.map((tk: any) => (
                  <button
                    key={tk.id}
                    onClick={() => { setSelectedTicket(tk.id); setTicketQuantity(1); }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left pressable",
                      selectedTicket === tk.id
                        ? "border-[var(--brand)] bg-[var(--brand-subtle)]"
                        : "border-[var(--border)] hover:border-[var(--brand)]/30"
                    )}
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-[var(--text)]">{tk.name}</h4>
                      {tk.description && (
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{tk.description}</p>
                      )}
                      <p className={cn(
                        "text-xs mt-1",
                        tk.remaining < 10 ? "text-[var(--error)]" : "text-[var(--text-tertiary)]"
                      )}>
                        {tk.remaining} / {tk.total} {t("event.remaining")}
                      </p>
                    </div>
                    <span className={cn("font-bold text-base", tk.price === 0 ? "text-[var(--success)]" : "text-[var(--brand)]")}>
                      {tk.price === 0 ? t("event.free") : formatCurrency(tk.price)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quantity & total */}
              {ticket && (
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--border-subtle)] card-hover">
                    <span className="text-sm font-medium text-[var(--text)]">{t("checkout.quantity")}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        disabled={ticketQuantity <= 1}
                        className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-sm font-medium disabled:opacity-40 hover:bg-[var(--border-subtle)] transition-colors pressable"
                        aria-label={t("common.viewMore")}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-semibold text-[var(--text)] tabular-nums">{ticketQuantity}</span>
                      <button
                        onClick={() => {
                          if (ticketQuantity < ticket.remaining) setTicketQuantity(ticketQuantity + 1);
                        }}
                        disabled={ticketQuantity >= ticket.remaining}
                        className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-sm font-medium disabled:opacity-40 hover:bg-[var(--border-subtle)] transition-colors pressable"
                        aria-label={t("common.viewMore")}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-[var(--text)] font-medium">{t("checkout.total")}</span>
                    <span className="text-xl font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">
                      {formatCurrency(ticket.price * ticketQuantity)}
                    </span>
                  </div>

                  <Button variant="primary" size="lg" className="w-full pressable" onClick={handleBuyTicket}>
                    {t("checkout.continue")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <BottomNav />
    </>
  );
}
