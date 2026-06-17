"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
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
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollFeatured = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -400 : 400, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { scrollFeatured("left"); e.preventDefault(); }
    if (e.key === "ArrowRight") { scrollFeatured("right"); e.preventDefault(); }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* ============================================= */}
        {/* HERO — Premium Terra */}
        {/* ============================================= */}
        <section className="relative min-h-[90dvh] max-sm:min-h-[80dvh] flex items-center overflow-hidden bg-gradient-to-b from-[var(--brand-subtle)] via-[var(--bg)] to-[var(--bg)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--brand)]/4 blur-[120px]" />
            <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[var(--accent)]/4 blur-[100px]" />
            <div className="absolute bottom-20 right-1/3 w-72 h-72 rounded-full bg-[var(--brand)]/3 blur-[100px]" />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 md:pt-36 md:pb-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[var(--brand-text)] text-[11px] font-semibold uppercase tracking-[0.15em] mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("common.appTagline")}</span>
              </div>

              <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-[var(--text)] mb-6 text-balance">
                {t("hero.title")}
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mb-10">
                {t("hero.subtitle")}
              </p>

              {/* Search — double-bezel */}
              <div className="max-w-xl mb-12">
                <div className="p-1.5 rounded-[1.5rem] bg-[var(--border-subtle)]">
                  <div className="flex items-center bg-[var(--surface)] rounded-[calc(1.5rem-0.375rem)] border border-[var(--border)] shadow-[var(--shadow)] transition-shadow duration-300 focus-within:shadow-[var(--shadow-md)] focus-within:border-[var(--brand)]/40 overflow-hidden">
                    <div className="flex items-center gap-2 pl-4 pr-2 py-1.5 border-r border-[var(--border)]">
                      <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" />
                      <select className="bg-transparent text-sm text-[var(--text)] font-medium outline-none cursor-pointer py-1.5 pr-2">
                        <option>{t("explore.allCities")}</option>
                        {CITIES.map((city) => (
                          <option key={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <Search className="w-4 h-4 text-[var(--text-tertiary)] ml-3 shrink-0" />
                    <input
                      type="text"
                      placeholder={t("explore.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent px-3 py-3.5 text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none"
                    />
                    <Button variant="primary" size="sm" className="mr-1.5 rounded-full hidden sm:inline-flex">
                      {t("common.search")}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Button variant="primary" size="lg" className="rounded-full px-8" asChild>
                  <Link href="/explore" transitionTypes={["nav-forward"]}>
                    {t("hero.cta")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                  <Link href="/register">
                    {t("nav.register")}
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
                  <span className="text-[var(--text-secondary)] ml-1">{t("about.stats.stats.users")}</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-[var(--text)]">150+</span>
                  <span className="text-[var(--text-secondary)] ml-1">{t("admin.events")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CATEGORIES — Macro whitespace */}
        {/* ============================================= */}
        <section className="py-16 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--brand-subtle)] text-[var(--brand-text)] text-[10px] font-semibold uppercase tracking-[0.15em] mb-3">{t("admin.categories")}</span>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--text)]">
                  {t("explore.title")}
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex" asChild>
                <Link href="/explore" transitionTypes={["nav-forward"]}>
                  {t("common.seeAll")} <ChevronRight className="w-4 h-4" />
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
        <section className="py-16 md:py-28 bg-[var(--brand-subtle)]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">{t("home.mustSee")}</span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--text)]">
                  {t("home.trending")}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-2">{t("home.recommended")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollFeatured("left")}
                  className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
                  aria-label={t("common.back")}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => scrollFeatured("right")}
                  className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
                  aria-label={t("common.seeAll")}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="region"
              aria-label={t("home.mustSee")}
              className="flex gap-5 overflow-x-auto scrollbar-hide scroll-container-touch pb-2 -mx-4 px-4 snap-x snap-mandatory focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-transparent rounded-2xl"
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
        <section className="py-16 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[var(--brand)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand)]">{t("ticket.upcoming")}</span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--text)]">
                  {t("home.thisWeek")}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-2">{t("home.forYou")}</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex" asChild>
                <Link href="/explore" transitionTypes={["nav-forward"]}>
                  {t("common.seeAll")} <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPCOMING_EVENTS.map((event) => (
                <EventCard key={event.id} event={event} variant="standard" />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                <Link href="/explore" transitionTypes={["nav-forward"]}>
                  {t("common.seeAll")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* TOP ORGANIZERS */}
        {/* ============================================= */}
        <section className="py-16 md:py-28 bg-[var(--border-subtle)]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-[var(--brand)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand)]">{t("event.organizer")}</span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl leading-tight text-[var(--text)]">
                  {t("admin.organizers")}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-2">{t("home.nearYou")}</p>
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
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{org.followersCount.toLocaleString()} {t("common.viewMore")} · {org.eventsCount} {t("admin.events")}</p>
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
        <section className="py-16 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] p-10 md:p-14 text-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-[100px]" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
              </div>
              <div className="relative">
                <TrendingUp className="w-10 h-10 text-[var(--accent)] mx-auto mb-5" />
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
                  {t("hero.createEvent")}
                </h2>
                <p className="text-white/70 max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
                  {t("common.appTagline")}
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button variant="accent" size="lg" className="rounded-full px-8" asChild>
                    <Link href="/register?role=organizer">
                      {t("hero.createEvent")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8 border-white/20 text-white hover:bg-white/10 hover:border-white/30" asChild>
                    <Link href="/explore">
                      {t("common.learnMore")}
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
                  <span className="font-extrabold text-base text-[var(--text)]">{t("common.appName")}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                  {t("footer.madeWith")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">{t("nav.explore")}</h3>
                <ul className="space-y-3">
                  <li><Link href="/explore" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("admin.events")}</Link></li>
                  <li><Link href="/explore?category=concert" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("home.recommended")}</Link></li>
                  <li><Link href="/explore?category=conference" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("home.trending")}</Link></li>
                  <li><Link href="/explore?category=gala" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("home.mustSee")}</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">{t("nav.dashboard")}</h3>
                <ul className="space-y-3">
                  <li><Link href="/register?role=organizer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("hero.createEvent")}</Link></li>
                  <li><Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("nav.dashboard")}</Link></li>
                  <li><Link href="/dashboard/events/new" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">{t("hero.createEvent")}</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[11px] uppercase tracking-[0.15em] text-[var(--text)] mb-4">{t("nav.legal")}</h3>
                <ul className="space-y-3">
                  <li><span className="text-sm text-[var(--text-secondary)]">{t("legal.terms")}</span></li>
                  <li><span className="text-sm text-[var(--text-secondary)]">{t("legal.privacy")}</span></li>
                  <li><span className="text-sm text-[var(--text-secondary)]">{t("nav.contact")}</span></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[var(--text-tertiary)]">&copy; 2025 {t("common.appName")}. {t("footer.rights")}</p>
              <p className="text-sm text-[var(--text-tertiary)]">{t("common.appTagline")}</p>
            </div>
          </div>
        </footer>
      </main>
      <BottomNav />
    </>
  );
}
