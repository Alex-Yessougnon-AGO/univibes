"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { Search, MapPin, ChevronRight, ArrowRight, Users, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { getCategoryIcon } from "@/lib/icon-map";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { eventsService, categoriesService } from "@/lib/services/events-service";

const EventCard = dynamic(() => import("@/components/events/event-card").then(m => ({ default: m.EventCard })));
const BottomNav = dynamic(() => import("@/components/layout/bottom-nav").then(m => ({ default: m.BottomNav })));

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, catsData] = await Promise.all([
          eventsService.findAll({ limit: 6 }),
          categoriesService.findAll(),
        ]);
        setEvents(Array.isArray(eventsData) ? eventsData : (eventsData as any)?.data ?? []);
        setCategories(catsData);
      } catch {
        // Fall back to empty state on error
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const FEATURED_EVENTS = events.slice(0, 5);
  const UPCOMING_EVENTS = events.slice(0, 6);
  const DISPLAY_CATEGORIES = categories.slice(0, 8);
  // Static cities list as fallback
  const CITIES_LIST = ["Cotonou", "Abomey-Calavi", "Porto-Novo", "Parakou", "Lokossa"];

  const handleHeroSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/explore?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/explore");
    }
  };

  const scrollFeatured = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -400 : 400, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { scrollFeatured("left"); e.preventDefault(); }
    if (e.key === "ArrowRight") { scrollFeatured("right"); e.preventDefault(); }
  };

  /* ── Scroll reveal — uses the shared hook ── */
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* ============================================= */}
        {/* HERO — Premium Terra */}
        {/* ============================================= */}
        <section role="banner" className="relative min-h-[90dvh] max-sm:min-h-[80dvh] flex items-center overflow-hidden bg-gradient-to-b from-[var(--brand-subtle)] via-[var(--bg)] to-[var(--bg)] reveal">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--brand)]/4 blur-[120px] ambient-float" />
            <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[var(--accent)]/4 blur-[100px] ambient-float-slow" />
            <div className="absolute bottom-20 right-1/3 w-72 h-72 rounded-full bg-[var(--brand)]/3 blur-[100px] ambient-float" />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-28 md:pb-20">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-7 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[var(--brand-text)] text-[11px] font-semibold uppercase tracking-[0.15em] mb-8">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t("common.appTagline")}</span>
              </div>

              <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,7vw,4.5rem)] leading-[1.05] tracking-tight text-[var(--text)] mb-5 text-balance">
                {t("hero.titleBefore")}
                <span className="text-[var(--brand)]">{t("hero.titleHighlight")}</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed mb-8">
                {t("hero.subtitle")}
              </p>

              {/* Search — editorial clean */}
              <form onSubmit={handleHeroSearch} className="max-w-xl mb-8 sm:mb-10" role="search" aria-label={t("explore.searchPlaceholder")}>
                <div className="flex items-center bg-[var(--surface)] rounded-[1.5rem] border border-[var(--border)] shadow-[var(--shadow-sm)] transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_var(--brand),0_4px_12px_rgba(0,0,0,0.08)]">
                  <div className="hidden sm:flex items-center gap-2 pl-4 pr-2 py-1.5 border-r border-[var(--border)] shrink-0 rounded-l-[1.5rem]">
                    <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
                    <select className="bg-transparent text-sm text-[var(--text)] font-medium outline-none cursor-pointer py-1.5 pr-2" aria-label={t("explore.city")}>
                      <option>{t("explore.allCities")}</option>
                      {CITIES_LIST.map((city) => (
                        <option key={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <Search className="w-4 h-4 text-[var(--text-tertiary)] ml-3 shrink-0" aria-hidden="true" />
                  <label htmlFor="hero-search" className="sr-only">{t("explore.searchPlaceholder")}</label>
                  <input
                    id="hero-search"
                    type="text"
                    name="q"
                    autoComplete="off"
                    placeholder={t("explore.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent px-2 sm:px-3 py-3 text-sm sm:py-3.5 text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none min-w-0"
                  />
                  <Button variant="primary" size="sm" className="mr-1.5 rounded-full max-sm:px-2.5 max-sm:flex shrink-0 sm:px-3 pressable" type="submit" aria-label={t("common.search")}>
                    <Search className="w-4 h-4 sm:hidden" aria-hidden="true" />
                    <span className="hidden sm:inline">{t("common.search")}</span>
                  </Button>
                </div>
              </form>

              <div className="flex items-center gap-3 flex-wrap">
                <Button variant="primary" size="lg" className="rounded-full pl-8 pr-2 pressable group" asChild>
                  <Link href="/explore" transitionTypes={["nav-forward"]}>
                    <span>{t("hero.cta")}</span>
                    <span className="ml-3 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 pressable" asChild>
                  <Link href="/register">
                    {t("nav.register")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero image — desktop only */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative">
                {/* Main image collage */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[var(--shadow-lg)] card-hover">
                    <Image
                      src="https://picsum.photos/seed/campus1/400/600"
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 0px, 240px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand)]/30 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-[var(--shadow)] card-hover">
                      <Image
                        src="https://picsum.photos/seed/campus2/400/400"
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 0px, 180px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[var(--shadow)] card-hover">
                      <Image
                        src="https://picsum.photos/seed/campus3/400/300"
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 0px, 180px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                {/* Floating stat badge */}
                <div className="absolute -bottom-3 -left-3 bg-[var(--surface)] rounded-xl shadow-[var(--shadow-lg)] border border-[var(--border)] px-4 py-3 card-hover">
                  <p className="text-xl font-bold text-[var(--brand)] font-[family-name:var(--font-display)]">500+</p>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">{t("admin.events")}</p>
                </div>
                {/* Top-right accent badge */}
                <div className="absolute -top-3 -right-3 bg-[var(--accent-subtle)] rounded-xl border border-[var(--accent)]/20 px-3 py-2 shadow-[var(--shadow)] card-hover">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                    <span className="text-xs font-bold text-[var(--accent)]">10K+</span>
                  </div>
                  <p className="text-[9px] text-[var(--accent)]/70 uppercase tracking-wider">{t("about.stats.users")}</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* ── Community Pulse — editorial statment ── */}
        <section className="py-16 md:py-20 reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-1">
                <div className="h-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8 flex flex-col justify-between card-hover">
                  <div className="flex -space-x-3 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="relative w-12 h-12 rounded-full border-2 border-[var(--surface)] overflow-hidden shadow-[var(--shadow-sm)] ring-2 ring-[var(--surface)] hover:z-10 hover:scale-110 transition-transform duration-200">
                        <Image src={`https://picsum.photos/seed/student${i}/100/100`} alt="" width={48} height={48} className="object-cover" loading="lazy" />
                      </div>
                    ))}
                    <div className="relative w-12 h-12 rounded-full border-2 border-[var(--surface)] bg-[var(--brand)] flex items-center justify-center shadow-[var(--shadow-sm)] ring-2 ring-[var(--surface)]">
                      <span className="text-white text-xs font-bold">+99</span>
                    </div>
                  </div>                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    <span className="font-bold text-[var(--text)]">2 400+</span> {t("about.stats.users").toLowerCase()} {t("homepage.communityLabel")}
                  </p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-2 gap-6 h-full">
                  <div className="rounded-2xl bg-[var(--brand-subtle)]/60 border border-[var(--brand)]/10 p-7 flex flex-col justify-center items-start card-hover">
                    <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--brand)] leading-none mb-1">150+</p>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">{t("admin.events")}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">{t("homepage.eventsMonthly")}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--accent-subtle)]/60 border border-[var(--accent)]/10 p-7 flex flex-col justify-center items-start card-hover">
                    <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--accent)] leading-none mb-1">10K+</p>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">{t("about.stats.users")}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">{t("homepage.activeStudents")}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-7 flex flex-col justify-center items-start col-span-2 card-hover">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      "{t("homepage.testimonialQuote")}"
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-7 h-7 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-[10px] font-bold">M</div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text)]">{t("homepage.testimonialName")}</p>
                        <p className="text-[10px] text-[var(--text-tertiary)]">{t("homepage.testimonialRole")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories — editorial bento ── */}
        <section className="py-16 md:py-24 reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl leading-tight text-[var(--text)]">
                  {t("explore.title")}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5">{t("home.forYou")}</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex pressable" asChild>
                <Link href="/explore" transitionTypes={["nav-forward"]}>
                  {t("common.seeAll")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            {/* Bento grid: varied sizes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DISPLAY_CATEGORIES.slice(0, 4).map((cat, index) => {
                const CatIcon = getCategoryIcon(cat.icon);
                return (
                  <Link
                    key={cat.id}
                    href={`/explore?category=${cat.slug}`}
                    className="group relative flex flex-col items-start justify-between p-6 min-h-[180px] md:min-h-[200px] rounded-2xl border overflow-hidden card-interactive reveal"
                    style={{
                      backgroundColor: `${cat.color}12`,
                      borderColor: `${cat.color}25`,
                      transitionDelay: `${index * 80}ms`
                    }}
                  >
                    {/* Decorative blob */}
                    <div
                      className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                      style={{ backgroundColor: `${cat.color}30` }}
                    />
                    <div
                      className="relative w-11 h-11 rounded-xl flex items-center justify-center card-hover"
                      style={{ backgroundColor: `${cat.color}25` }}
                    >
                      <CatIcon className="w-5 h-5" style={{ color: cat.color }} aria-hidden="true" />
                    </div>
                    <div className="relative">
                      <span className="block text-sm font-bold text-[var(--text)]">{cat.name}</span>
                      <span className="text-xs text-[var(--text-tertiary)] mt-0.5 block">{t("homepage.exploreCategory")}</span>
                    </div>
                  </Link>
                );
              })}
              {/* Second row: horizontal pills for remaining categories */}
              <div className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3 reveal" style={{ transitionDelay: '350ms' }}>
                {DISPLAY_CATEGORIES.slice(4).map((cat, index) => {
                  const CatIcon = getCategoryIcon(cat.icon);
                  return (
                    <Link
                      key={cat.id}
                      href={`/explore?category=${cat.slug}`}
                      className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/25 transition duration-200 ease-[var(--ease-out)] pressable"
                      style={{ transitionDelay: `${index * 60}ms` }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}18` }}
                      >
                        <CatIcon className="w-4 h-4" style={{ color: cat.color }} aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] ml-auto shrink-0" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* FEATURED EVENTS */}
        {/* ============================================= */}
        <section className="py-14 md:py-20 bg-[var(--brand-subtle)]/40 reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">              <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl leading-tight text-[var(--text)]">
                  {t("home.trending")}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1.5">{t("home.recommended")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollFeatured("left")}
                  className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition duration-150 ease-[var(--ease-out)]"
                  aria-label={t("common.back")}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
                </button>
                <button
                  onClick={() => scrollFeatured("right")}
                  className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition duration-150 ease-[var(--ease-out)]"
                  aria-label={t("common.seeAll")}
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="region"
              aria-label={t("home.mustSee")}
              className="flex gap-5 overflow-x-auto scrollbar-hide scroll-container-touch pb-2 -mx-4 px-4 snap-x snap-mandatory focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-transparent rounded-2xl card-hover"
            >
              {FEATURED_EVENTS.map((event, index) => (
                <div key={event.id} className="snap-start shrink-0 w-[300px] sm:w-[340px] md:w-[440px] reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                  <EventCard event={event} variant="featured" priority instanceId={`feat-${index}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* UPCOMING EVENTS */}
        {/* ============================================= */}
        <section className="py-14 md:py-20 reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">              <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl leading-tight text-[var(--text)]">
                  {t("home.thisWeek")}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1.5">{t("home.forYou")}</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex pressable" asChild>
                <Link href="/explore" transitionTypes={["nav-forward"]}>
                  {t("common.seeAll")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPCOMING_EVENTS.map((event, index) => (
                <div key={event.id} className="reveal" style={{ transitionDelay: `${index * 80}ms` }}>
                  <EventCard event={event} variant="standard" instanceId={`upcoming-${index}`} />
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">                  <Button variant="outline" size="lg" className="rounded-full px-8 pressable" asChild>
                    <Link href="/explore" transitionTypes={["nav-forward"]}>
                  {t("common.seeAll")}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* TOP ORGANIZERS */}
        {/* ============================================= */}
        <section className="py-14 md:py-20 bg-[var(--border-subtle)]/60 reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">              <div className="mb-8">
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl leading-tight text-[var(--text)]">
                {t("admin.organizers")}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1.5">{t("home.nearYou")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {events.slice(0, 4).map((ev: any, index: number) => (
                <Link
                  key={ev?.id || index}
                  href={`/organizer/${ev?.organizer?.slug || '#'}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand)]/20 hover:shadow-[var(--shadow-md)] transition duration-200 ease-[var(--ease-out)] reveal"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 ring-2 ring-[var(--brand)]/15 card-hover">
                    <Image src={`https://picsum.photos/seed/org${index}/100/100`} alt="" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-sm text-[var(--text)] truncate">{ev?.title || t("admin.organizers")}</h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t("admin.events")}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CTA BANNER — premium split */}
        {/* ============================================= */}
        <section className="py-16 md:py-24 reveal">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] p-8 md:p-14">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-[100px] ambient-float-slow" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[var(--accent)]/10 blur-[80px] ambient-float" />
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
                  backgroundSize: '48px 48px'
                }} />
              </div>
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <TrendingUp className="w-8 h-8 text-white/60 mb-4 mx-auto md:mx-0" aria-hidden="true" />
                  <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl text-white mb-3 leading-tight text-balance">
                    {t("hero.createEvent")}
                  </h2>
                  <p className="text-white/70 max-w-md mx-auto md:mx-0 mb-6 text-sm md:text-base leading-relaxed">
                    {t("common.appTagline")}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                    <Button variant="accent" size="lg" className="rounded-full pl-8 pr-2 pressable group" asChild>
                      <Link href="/register?role=organizer">
                        <span>{t("hero.createEvent")}</span>
                        <span className="ml-3 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full px-8 border-white/20 text-white hover:bg-white/10 hover:border-white/30 pressable" asChild>
                      <Link href="/explore">
                        {t("common.learnMore")}
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden md:flex flex-col gap-4">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-6 card-hover">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white/70 text-xs font-mono">{t("homepage.growingEvents")}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white font-[family-name:var(--font-display)]">+47%</span>
                      <span className="text-white/50 text-xs">{t("homepage.ctaQuarter")}</span>
                    </div>
                    <p className="text-white/50 text-xs mt-1.5">{t("homepage.ctaDescription")}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 card-hover">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1.5">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-7 h-7 rounded-full border border-white/20 overflow-hidden">
                            <Image src={`https://picsum.photos/seed/org${i}/50/50`} alt="" width={28} height={28} className="object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-white/60 text-xs">50+ {t("homepage.ctaOrganizers")}</span>
                    </div>
                  </div>
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
