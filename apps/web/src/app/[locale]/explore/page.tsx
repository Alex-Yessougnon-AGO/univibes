"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, Grid3X3, List, MapPin, Sparkles } from "lucide-react";
import { CategoryIcon } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ApiEvent, eventsService, categoriesService } from "@/lib/services/events-service";

const CITIES_LIST = ["Cotonou", "Abomey-Calavi", "Porto-Novo", "Parakou", "Lokossa"];

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreFallback() {
  const t = useTranslations();
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--brand)] border-t-transparent animate-spin" />
        <p className="text-sm text-[var(--text-secondary)]">{t("common.loading")}</p>
      </div>
    </div>
  );
}

function ExploreContent() {
  useScrollReveal();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('q');
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearch(searchParam);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, catsData] = await Promise.all([
          eventsService.findAll({ limit: 100 }),
          categoriesService.findAll(),
        ]);
        setAllEvents(Array.isArray(eventsData) ? eventsData : (eventsData as any)?.data ?? []);
        setCategories(catsData);
      } catch {
        // API error - use empty state
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const SORT_OPTIONS = [
    { value: "date", label: t("explore.sortDate") },
    { value: "popularity", label: t("explore.sortPopularity") },
    { value: "price-asc", label: t("explore.sortPriceAsc") },
    { value: "price-desc", label: t("explore.sortPriceDesc") },
  ];

  const PRICE_OPTIONS = [
    { value: "all", label: t("explore.allPrices") },
    { value: "free", label: t("explore.free") },
    { value: "paid", label: t("explore.paid") },
  ];

  const filteredEvents = useMemo(() => {
    let result = [...allEvents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e: any) =>
          (e.title || '').toLowerCase().includes(q) ||
          (e.description || '').toLowerCase().includes(q) ||
          (e.organizer?.name || '').toLowerCase().includes(q) ||
          (e.tags?.some((t: string) => t.toLowerCase().includes(q)))
      );
    }
    if (selectedCategory) {
      result = result.filter((e: any) => e.category?.slug === selectedCategory);
    }
    if (selectedCity) {
      result = result.filter((e: any) => e.city === selectedCity);
    }
    if (priceRange === "free") result = result.filter((e: any) => e.isFree);
    else if (priceRange === "paid") result = result.filter((e: any) => !e.isFree);
    switch (sortBy) {
      case "date":
        result.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case "popularity":
        result.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
        break;
      case "price-asc":
        result.sort((a: any, b: any) => (a.lowestPrice ?? 0) - (b.lowestPrice ?? 0));
        break;
      case "price-desc":
        result.sort((a: any, b: any) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0));
        break;
    }
    return result;
  }, [search, selectedCategory, selectedCity, priceRange, sortBy, allEvents]);

  const hasActiveFilters = selectedCategory || selectedCity || priceRange !== "all";
  const activeFilterCount = [selectedCategory, selectedCity, priceRange !== "all" ? "p" : ""].filter(Boolean).length;

  const FiltersPanel = ({ mobile }: { mobile?: boolean }) => (
    <div className={cn("space-y-5", mobile && "p-0.5")}>
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          {t("explore.search")}
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder={t("explore.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          {t("explore.category")}
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("")}
            className={cn(
              "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 pressable",
              !selectedCategory
                ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            )}
          >
            {t("explore.allCategories")}
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 pressable",
                selectedCategory === cat.slug
                  ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                  : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
              )}
            >
              <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          {t("explore.city")}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] outline-none appearance-none transition-all duration-200 focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          >
            <option value="">{t("explore.allCities")}</option>
            {CITIES_LIST.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          {t("explore.price")}
        </label>
        <div className="flex gap-1.5">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriceRange(opt.value)}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 pressable",
                priceRange === opt.value
                  ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                  : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* ── Clean header ── */}
        <section className="pt-8 pb-4 md:pt-10 md:pb-6 reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <h1 className="text-[28px] md:text-4xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
                  {t("explore.title")}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  <Sparkles className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1 text-[var(--brand)]" aria-hidden="true" />
                  {filteredEvents.length === 1
                    ? t("explore.results", { count: 1 })
                    : t("explore.results_plural", { count: filteredEvents.length })}
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-end">
                <div className="flex items-center gap-1 bg-[var(--border-subtle)] rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 pressable",
                      viewMode === "grid" ? "bg-[var(--surface)] shadow-[var(--shadow-sm)] text-[var(--text)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    )}
                    aria-label={t("explore.viewMode")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 pressable",
                      viewMode === "list" ? "bg-[var(--surface)] shadow-[var(--shadow-sm)] text-[var(--text)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    )}
                    aria-label={t("explore.viewMode")}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick filters row */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-container-touch pb-1">
              <button
                onClick={() => setShowMobileFilters(true)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 shrink-0 pressable",
                  hasActiveFilters
                    ? "border-[var(--brand)]/30 bg-[var(--brand-subtle)] text-[var(--brand-text)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]"
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {t("explore.filters")}
                {hasActiveFilters && (
                  <span className="w-4.5 h-4.5 rounded-full bg-[var(--brand)] text-white text-[9px] flex items-center justify-center font-bold ml-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {categories.slice(0, 6).map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 shrink-0 whitespace-nowrap pressable",
                    selectedCategory === cat.slug
                      ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                      : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]"
                  )}
                >
                  <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              ))}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--text)] outline-none shrink-0 transition-all duration-200 focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
                aria-label={t("explore.sortBy")}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 reveal">
          <div className="flex gap-8">
            {/* Sidebar filters — desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-sm text-[var(--text)]">{t("explore.filters")}</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={() => { setSelectedCategory(""); setSelectedCity(""); setPriceRange("all"); }}
                      className="text-xs text-[var(--brand)] font-medium hover:text-[var(--brand-hover)] transition-colors pressable"
                    >
                      {t("explore.clearAll")}
                    </button>
                  )}
                </div>
                <FiltersPanel />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Active filter badges */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-xs font-medium text-[var(--brand-text)]">
                      <CategoryIcon name={categories.find((c: any) => c.slug === selectedCategory)?.icon ?? ""} className="w-3 h-3" />
                      {categories.find((c: any) => c.slug === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory("")} className="hover:text-[var(--text)] transition-colors pressable" aria-label={t("common.close")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedCity && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-xs font-medium text-[var(--brand-text)]">
                      <MapPin className="w-3 h-3" />
                      {selectedCity}
                      <button onClick={() => setSelectedCity("")} className="hover:text-[var(--text)] transition-colors pressable" aria-label={t("common.close")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {priceRange !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-xs font-medium text-[var(--brand-text)]">
                      {priceRange === "free" ? t("explore.free") : t("explore.paid")}
                      <button onClick={() => setPriceRange("all")} className="hover:text-[var(--text)] transition-colors pressable" aria-label={t("common.close")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Events grid */}
              {filteredEvents.length > 0 ? (
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                      : "space-y-4"
                  )}
                >
                  {filteredEvents.map((event, i) => (
                    <div
                      key={event.id}
                      className="reveal"
                      style={{ transitionDelay: `${i * 40}ms` }}
                    >
                      <EventCard event={event} variant={viewMode === "list" ? "compact" : "standard"} />
                    </div>
                  ))}
                </div>
              ) : (
                /* ── Empty state — editorial ── */
                <div className="text-center py-24 reveal">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--border-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6 card-hover">
                    <Search className="w-8 h-8 text-[var(--text-tertiary)]" />
                  </div>
                  <h3 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
                    {t("explore.noResults")}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-sm mx-auto leading-relaxed">
                    {t("explore.noResultsDesc")}
                  </p>
                  <div className="flex items-center gap-3 justify-center flex-wrap">
                    <Button
                      variant="primary"
                      size="md"
                      className="rounded-full px-6 pressable"
                      onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedCity(""); setPriceRange("all"); }}
                    >
                      {t("explore.resetFilters")}
                    </Button>
                    <Button variant="outline" size="md" className="rounded-full px-6 pressable" asChild>
                      <a href="/">
                        {t("common.home")}
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── Mobile filters drawer — CSS-only animation ── */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0,1)]",
          showMobileFilters ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!showMobileFilters}
      >
        {/* Overlay backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            showMobileFilters ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setShowMobileFilters(false)}
        />
        {/* Bottom sheet */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow-lg)] transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0,1)]",
            showMobileFilters ? "translate-y-0" : "translate-y-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[var(--text)]">{t("explore.filters")}</h3>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-8 h-8 rounded-lg bg-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border)] transition-colors pressable"
              aria-label={t("common.close")}
            >
              <X className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          </div>
          <FiltersPanel mobile />
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <Button
              variant="primary"
              size="md"
              className="w-full pressable"
              onClick={() => setShowMobileFilters(false)}
            >
              {t("explore.viewResults", { count: filteredEvents.length })}
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
