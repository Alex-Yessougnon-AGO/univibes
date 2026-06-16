"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ChevronRight, ArrowRight, Star, Calendar, Users, Sparkles, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { CategoryChip } from "@/components/shared/category-chip";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { EVENTS, CATEGORIES, ORGANIZERS, CITIES } from "@/lib/mock-data";
import type { MockEvent } from "@/lib/mock-data";
import { getCategoryIcon } from "@/lib/icon-map";
import { cn, formatShortDate, formatTime, formatCurrency } from "@/lib/utils";

const FEATURED_EVENTS = EVENTS.filter((e) => e.isFavorited || e.views > 5000).slice(0, 5);
const UPCOMING_EVENTS = EVENTS.slice(0, 6);
const TOP_ORGANIZERS = ORGANIZERS.filter((o) => o.verified).slice(0, 4);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        {/* ============================================= */}
        {/* HERO — Premium Terra */}
        {/* ============================================= */}
        <section className="relative min-h-[90dvh] flex items-center overflow-hidden bg-gradient-to-b from-[var(--brand-subtle)] via-[var(--bg)] to-[var(--bg)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--brand)]/4 blur-[120px]" />
            <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[var(--accent)]/4 blur-[100px]" />
            <div className="absolute bottom-20 right-1/3 w-72 h-72 rounded-full bg-[var(--brand)]/3 blur-[100px]" />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 md:pt-36 md:pb-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[var(--brand-text)] text-[11px] font-semibold uppercase tracking-[0.15em] mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Le hub de la vie étudiante</span>
              </div>

              <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-[var(--text)] mb-6 text-balance">
                Découvre tout ce qui se passe<br />
                <span className="text-gradient-brand">sur ton campus</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mb-10">
                Soirées, conférences, hackathons, galas — trouve et réserve les meilleurs événements étudiants près de chez toi.
              </p>

              {/* Search — double-bezel */}
              <div className="max-w-xl mb-12">
                <div className="p-1.5 rounded-[1.5rem] bg-[var(--border-subtle)]">
                  <div className="flex items-center bg-[var(--surface)] rounded-[calc(1.5rem-0.375rem)] border border-[var(--border)] shadow-[var(--shadow)] transition-shadow duration-300 focus-within:shadow-[var(--shadow-md)] focus-within:border-[var(--brand)]/40 overflow-hidden">
                    <div className="flex items-center gap-2 pl-4 pr-2 py-1.5 border-r border-[var(--border)]">
                      <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" />
                      <select className="bg-transparent text-sm text-[var(--text)] font-medium outline-none cursor-pointer py-1.5 pr-2">
                        <option>Toutes les villes</option>
                        {CITIES.map((city) => (
                          <option key={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <Search className="w-4 h-4 text-[var(--text-tertiary)] ml-3 shrink-0" />
                    <input
                      type="text"
                      placeholder="Rechercher un événement, un organisateur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent px-3 py-3.5 text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none"
                    />
                    <Button variant="primary" size="sm" className="mr-1.5 rounded-full hidden sm:inline-flex">
                      Rechercher
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Button variant="primary" size="lg" className="rounded-full px-8" asChild>
                  <Link href="/explore" transitionTypes={["nav-forward"]}>
                    Explorer les événements
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                  <Link href="/register">
                    Créer un compte
                  </Link>
                </Button>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4 sm:gap-6 mt-12 pt-8 border-t border-[var(--border)] flex-wrap">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[var(--surface)] overflow-hidden">
                      <Image src={`https://picsum.photos/seed/student${i}/100/100`} alt="" width={36} height={36} className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-[var(--text)]">2 400+</span>
                  <span className="text-[var(--text-secondary)] ml-1">étudiants inscrits</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-[var(--text)]">150+</span>
                  <span className="text-[var(--text-secondary)] ml-1">événements</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CATEGORIES — Macro whitespace */}
        {/* ============================================= */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--brand-subtle)] text-[var(--brand-text)] text-[10px] font-semibold uppercase tracking-[0.15em] mb-3">Catégories</span>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--text)]">
                  Parcourir par catégorie
                </h2>
              </div>                  <Button variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex" asChild>
                <Link href="/explore" transitionTypes={["nav-forward"]}>
                  Voir tout <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {CATEGORIES.map((cat) => {
                const CatIcon = getCategoryIcon(cat.icon);
                return (
                  <Link
                    key={cat.id}
                    href={`/explore?category=${cat.slug}`}
                    className="group relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand)]/20 transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at 50% 0%, ${cat.color}20 0%, transparent 70%)`
                      }}
                    />
                    <div
                      className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{ backgroundColor: `${cat.color}18` }}
                    >
                      <CatIcon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <span className="relative text-xs font-semibold text-[var(--text)]">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* FEATURED EVENTS — Double-bezel cards */}
        {/* ============================================= */}
        <section className="py-24 md:py-32 bg-[var(--brand-subtle)]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">À la une</span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--text)]">
                  Événements populaires
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-2">Les événements les plus en vue du moment</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })}
                  className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
                  aria-label="Défiler vers la gauche"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })}
                  className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
                  aria-label="Défiler vers la droite"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide scroll-container-touch pb-2 -mx-4 px-4 snap-x snap-mandatory"
            >
              {FEATURED_EVENTS.map((event) => (
                <div key={event.id} className="snap-start shrink-0 w-[300px] sm:w-[340px] md:w-[440px]">
                  <EventCard event={event} variant="featured" priority />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* UPCOMING EVENTS */}
        {/* ============================================= */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[var(--brand)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand)]">À venir</span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--text)]">
                  Événements à venir
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-2">Ne rate pas les prochains rendez-vous</p>
              </div>                  <Button variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex" asChild>
                <Link href="/explore" transitionTypes={["nav-forward"]}>
                  Voir tout <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPCOMING_EVENTS.map((event) => (
                <EventCard key={event.id} event={event} variant="standard" />
              ))}
            </div>
            <div className="mt-12 text-center">                  <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                <Link href="/explore" transitionTypes={["nav-forward"]}>
                  Voir tous les événements
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* TOP ORGANIZERS */}
        {/* ============================================= */}
        <section className="py-24 md:py-32 bg-[var(--border-subtle)]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-[var(--brand)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand)]">Organisateurs</span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--text)]">
                  Top organisateurs
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-2">Les associations et clubs les plus actifs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TOP_ORGANIZERS.map((org) => (
                <Link
                  key={org.id}
                  href={`/organizer/${org.slug}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand)]/20 hover:shadow-[var(--shadow-md)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 ring-2 ring-[var(--brand)]/15">
                    <Image src={org.logoUrl} alt={org.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-sm text-[var(--text)] truncate">{org.name}</h3>
                      {org.verified && (
                        <span className="w-4 h-4 rounded-full bg-[var(--brand)] flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 16 16" fill="white" className="w-2.5 h-2.5">
                            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{org.followersCount.toLocaleString()} abonnés · {org.eventsCount} événements</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CTA BANNER — Brand gradient */}
        {/* ============================================= */}
        <section className="py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] p-10 md:p-14 text-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-[100px]" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
              </div>
              <div className="relative">
                <TrendingUp className="w-10 h-10 text-[var(--accent)] mx-auto mb-5" />
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
                  Tu organises des événements ?
                </h2>
                <p className="text-white/70 max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
                  Rejoins Univibes et donne de la visibilité à tes événements. Crée, promeut et vends tes billets en toute simplicité.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button variant="accent" size="lg" className="rounded-full px-8" asChild>
                    <Link href="/register?role=organizer">
                      Devenir organisateur
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8 border-white/20 text-white hover:bg-white/10 hover:border-white/30" asChild>
                    <Link href="/explore">
                      En savoir plus
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* FOOTER */}
        {/* ============================================= */}
        <footer className="border-t border-[var(--border)] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[var(--brand)] flex items-center justify-center shadow-[var(--shadow-brand)]">
                    <span className="text-white font-black text-sm">UV</span>
                  </div>
                  <span className="font-extrabold text-base text-[var(--text)]">Univibes</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                  La plateforme de référence pour découvrir et promouvoir les événements étudiants au Bénin.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">Découvrir</h3>
                <ul className="space-y-3">
                  <li><Link href="/explore" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">Événements</Link></li>
                  <li><Link href="/explore?category=concert" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">Concerts</Link></li>
                  <li><Link href="/explore?category=conference" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">Conférences</Link></li>
                  <li><Link href="/explore?category=gala" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">Galas</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">Pour les orgas</h3>
                <ul className="space-y-3">
                  <li><Link href="/register?role=organizer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">Devenir organisateur</Link></li>
                  <li><Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">Dashboard</Link></li>
                  <li><Link href="/dashboard/events/new" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">Créer un événement</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">Légal</h3>
                <ul className="space-y-3">
                  <li><span className="text-sm text-[var(--text-secondary)]">CGU</span></li>
                  <li><span className="text-sm text-[var(--text-secondary)]">Confidentialité</span></li>
                  <li><span className="text-sm text-[var(--text-secondary)]">Contact</span></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[var(--text-tertiary)]">&copy; 2025 Univibes. Tous droits réservés.</p>
              <p className="text-sm text-[var(--text-tertiary)]">The Hub of Student Life</p>
            </div>
          </div>
        </footer>
      </main>
      <BottomNav />
    </>
  );
}
