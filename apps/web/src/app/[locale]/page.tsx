"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { SectionHeader } from "@/components/shared/section-header";
import { getCategoryIcon } from "@/lib/icon-map";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { eventsService, categoriesService } from "@/lib/services/events-service";

const EventCard = dynamic(() =>
  import("@/components/events/event-card").then((m) => ({ default: m.EventCard }))
);
const BottomNav = dynamic(() =>
  import("@/components/layout/bottom-nav").then((m) => ({ default: m.BottomNav }))
);

const CITIES_LIST = ["Cotonou", "Abomey-Calavi", "Porto-Novo", "Parakou", "Lokossa"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const t = useTranslations();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, catsData] = await Promise.all([
          eventsService.findAll({ limit: 9 }),
          categoriesService.findAll(),
        ]);
        setEvents(Array.isArray(eventsData) ? eventsData : (eventsData as any)?.data ?? []);
        setCategories(catsData ?? []);
      } catch {
        /* l'état vide s'affiche gracieusement */
      }
    };
    loadData();
  }, []);

  const FEATURED_EVENTS = events.slice(0, 5);
  const UPCOMING_EVENTS = events.slice(0, 6);
  const DISPLAY_CATEGORIES = categories.slice(0, 8);

  const handleHeroSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (city) params.set("city", city);
    const qs = params.toString();
    router.push(qs ? `/explore?${qs}` : "/explore");
  };

  const scrollFeatured = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -440 : 440,
      behavior: "smooth",
    });
  };

  useScrollReveal();

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* ═══════════ HERO — un message, une action ═══════════ */}
        <section role="banner" className="relative overflow-hidden">
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />

          <div className="relative container-narrow pt-16 pb-14 md:pt-28 md:pb-24 text-center">
            <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-xs font-bold text-[var(--text-secondary)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brand)]" aria-hidden="true" />
              {t("common.appTagline")}
            </div>

            <h1 className="reveal display text-[clamp(2.5rem,7vw,4.75rem)] text-[var(--text)] mt-7">
              {t("hero.titleBefore")}
              <span className="text-[var(--brand)]">{t("hero.titleHighlight")}</span>
            </h1>

            <p className="reveal lead max-w-xl mx-auto mt-5">{t("hero.subtitle")}</p>

            {/* Recherche — l'unique porte d'entrée */}
            <form
              onSubmit={handleHeroSearch}
              role="search"
              aria-label={t("explore.searchPlaceholder")}
              className="reveal max-w-2xl mx-auto mt-9"
            >
              <div className="flex items-center gap-1 bg-[var(--surface)] rounded-full border border-[var(--border)] shadow-[var(--shadow-md)] p-2 pl-2 transition-shadow focus-within:shadow-[var(--shadow-lg)] focus-within:border-[var(--brand)]/40">
                <div className="hidden sm:flex items-center gap-1.5 pl-3 pr-4 border-r border-[var(--border)] shrink-0">
                  <MapPin className="w-4 h-4 text-[var(--brand)]" aria-hidden="true" />
                  <label htmlFor="hero-city" className="sr-only">
                    {t("explore.city")}
                  </label>
                  <select
                    id="hero-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-transparent text-sm text-[var(--text)] font-semibold outline-none cursor-pointer py-2.5 pr-1 max-w-[130px]"
                  >
                    <option value="">{t("explore.allCities")}</option>
                    {CITIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <Search className="w-[18px] h-[18px] text-[var(--text-tertiary)] ml-3 shrink-0" aria-hidden="true" />
                <label htmlFor="hero-search" className="sr-only">
                  {t("explore.searchPlaceholder")}
                </label>
                <input
                  id="hero-search"
                  type="text"
                  autoComplete="off"
                  placeholder={t("explore.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-2.5 py-2.5 text-[15px] text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none min-w-0"
                />
                <Button type="submit" variant="primary" size="md" className="rounded-full px-6 shrink-0">
                  <span className="hidden sm:inline">{t("common.search")}</span>
                  <Search className="w-4 h-4 sm:hidden" aria-hidden="true" />
                </Button>
              </div>
            </form>

            {/* Preuve sociale — discrète */}
            <div className="reveal flex items-center justify-center gap-3 mt-8">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="relative w-8 h-8 rounded-full border-2 border-[var(--bg)] overflow-hidden"
                  >
                    <Image
                      src={`https://picsum.photos/seed/student${i}/64/64`}
                      alt=""
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text)] font-bold">2 400+</strong>{" "}
                {t("about.stats.users").replace(/^[\d\s+]+/, "").toLowerCase()}{" "}
                {t("homepage.communityLabel")}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ CHIFFRES — trois preuves, rien de plus ═══════════ */}
        <section className="border-y border-[var(--border)] bg-[var(--surface)]" aria-label="Chiffres clés">
          <div className="container-x grid grid-cols-3 divide-x divide-[var(--border-subtle)]">
            {[
              { value: "150+", label: t("admin.events") },
              { value: "10K+", label: t("homepage.activeStudents") },
              { value: "50+", label: t("homepage.ctaOrganizers") },
            ].map((stat) => (
              <div key={stat.label} className="reveal text-center py-8 md:py-10 px-2">
                <p className="display text-3xl md:text-[40px] text-[var(--brand)] tabular-nums">
                  {stat.value}
                </p>
                <p className="text-xs md:text-[13px] text-[var(--text-secondary)] font-medium mt-1.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ CATÉGORIES ═══════════ */}
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={t("home.forYou")}
              title={t("explore.title")}
              action={
                <Button variant="ghost" size="md" className="rounded-full" asChild>
                  <Link href="/explore" transitionTypes={["nav-forward"]}>
                    {t("common.seeAll")}
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {DISPLAY_CATEGORIES.map((cat, index) => {
                const CatIcon = getCategoryIcon(cat.icon);
                return (
                  <Link
                    key={cat.id}
                    href={`/explore?category=${cat.slug}`}
                    className="reveal group flex items-center gap-4 p-5 md:p-6 card-xl card-hover"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <span
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{ backgroundColor: `${cat.color}1a` }}
                    >
                      <CatIcon className="w-[22px] h-[22px]" style={{ color: cat.color }} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold text-[15px] text-[var(--text)] leading-tight">
                        {cat.name}
                      </span>
                      <span className="block text-[13px] text-[var(--text-tertiary)] mt-1">
                        {t("homepage.exploreCategory")}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ À LA UNE ═══════════ */}
        {FEATURED_EVENTS.length > 0 && (
          <section className="section !pt-0">
            <div className="container-x">
              <SectionHeader
                eyebrow={t("home.trending")}
                title={t("home.mustSee")}
                description={t("home.recommended")}
                action={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollFeatured("left")}
                      className="w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text)] hover:border-[var(--brand)]/40 transition-colors pressable"
                      aria-label={t("common.back")}
                    >
                      <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => scrollFeatured("right")}
                      className="w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text)] hover:border-[var(--brand)]/40 transition-colors pressable"
                      aria-label={t("common.seeAll")}
                    >
                      <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                }
              />
            </div>
            <div
              ref={scrollRef}
              role="region"
              aria-label={t("home.mustSee")}
              className="flex gap-5 overflow-x-auto scrollbar-hide scroll-container-touch pb-2 px-4 sm:px-6 snap-x snap-mandatory"
              style={{ paddingInline: "max(1rem, calc((100vw - 76rem) / 2 + 1.5rem))" }}
            >
              {FEATURED_EVENTS.map((event, index) => (
                <div key={event.id} className="snap-start shrink-0 reveal" style={{ transitionDelay: `${index * 80}ms` }}>
                  <EventCard event={event} variant="featured" priority={index === 0} instanceId={`feat-${index}`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════ CETTE SEMAINE ═══════════ */}
        <section className="section !pt-0">
          <div className="container-x">
            <SectionHeader
              eyebrow={t("home.thisWeek")}
              title={t("home.forYou")}
              action={
                <Button variant="outline" size="md" className="rounded-full" asChild>
                  <Link href="/explore" transitionTypes={["nav-forward"]}>
                    {t("common.seeAll")}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {UPCOMING_EVENTS.map((event, index) => (
                <div key={event.id} className="reveal" style={{ transitionDelay: `${index * 70}ms` }}>
                  <EventCard event={event} variant="standard" instanceId={`upcoming-${index}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ ORGANISATEURS ═══════════ */}
        <section className="section !pt-0">
          <div className="container-x">
            <div className="card-sheet p-8 md:p-12">
              <SectionHeader
                align="center"
                eyebrow={t("home.nearYou")}
                title={t("admin.organizers")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {events.slice(0, 4).map((ev: any, index: number) => (
                  <Link
                    key={ev?.id || index}
                    href={`/organizer/${ev?.organizer?.slug || "#"}`}
                    className="reveal group flex items-center gap-4 p-5 rounded-[1.25rem] border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)]/30 hover:shadow-[var(--shadow-md)] transition-all duration-200"
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <span className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                      <Image
                        src={ev?.organizer?.logoUrl || `https://picsum.photos/seed/org${index}/112/112`}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-sm text-[var(--text)] truncate">
                        {ev?.organizer?.name || t("admin.organizers")}
                      </span>
                      <span className="block text-[13px] text-[var(--text-secondary)] mt-0.5">
                        {ev?.organizer?.eventsCount ?? ""} {t("admin.events").toLowerCase()}
                      </span>
                    </span>
                    <ChevronRight
                      className="w-4 h-4 text-[var(--text-tertiary)] shrink-0 group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-all"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ TÉMOIGNAGE ═══════════ */}
        <section className="section !pt-0">
          <div className="container-narrow text-center reveal">
            <div className="flex justify-center gap-1 mb-6" aria-label="5/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} viewBox="0 0 20 20" className="w-5 h-5 fill-[var(--brand)]" aria-hidden="true">
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              ))}
            </div>
            <blockquote className="display text-2xl md:text-[32px] leading-snug text-[var(--text)]">
              «&nbsp;{t("homepage.testimonialQuote")}&nbsp;»
            </blockquote>
            <div className="flex items-center justify-center gap-3 mt-7">
              <span className="w-11 h-11 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-sm font-bold">
                {t("homepage.testimonialName").charAt(0)}
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold text-[var(--text)]">
                  {t("homepage.testimonialName")}
                </span>
                <span className="block text-[13px] text-[var(--text-secondary)]">
                  {t("homepage.testimonialRole")}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════ CTA ORGANISATEUR — simple, franc ═══════════ */}
        <section className="section !pt-0">
          <div className="container-x">
            <div className="reveal relative overflow-hidden rounded-[2rem] bg-[var(--brand)] px-8 py-14 md:p-20 text-center">
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                aria-hidden="true"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`,
                  backgroundSize: "44px 44px",
                }}
              />
              <div className="relative">
                <p className="eyebrow !text-white/70 justify-center mb-4">
                  {t("homepage.ctaOrganizers")}
                </p>
                <h2 className="display text-3xl md:text-5xl text-white">
                  {t("hero.createEvent")}
                </h2>
                <p className="text-white/75 max-w-md mx-auto mt-4 leading-relaxed">
                  {t("homepage.ctaDescription")}
                </p>
                <div className="flex items-center justify-center gap-3 mt-9 flex-wrap">
                  <Button
                    size="lg"
                    className="rounded-full bg-white text-[var(--brand-hover)] hover:bg-white/90 shadow-lg pressable font-bold"
                    asChild
                  >
                    <Link href="/register?role=organizer">
                      {t("hero.createEvent")}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/25 text-white hover:bg-white/10 hover:border-white/40 pressable"
                    asChild
                  >
                    <Link href="/pricing">{t("common.learnMore")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
