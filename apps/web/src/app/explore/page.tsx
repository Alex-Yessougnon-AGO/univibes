"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, Grid3X3, List, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { EVENTS, CATEGORIES, CITIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "popularity", label: "Popularité" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredEvents = useMemo(() => {
    let result = [...EVENTS];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.organizer.name.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) {
      result = result.filter((e) => e.category.slug === selectedCategory);
    }
    if (selectedCity) {
      result = result.filter((e) => e.city === selectedCity);
    }
    if (priceRange === "free") result = result.filter((e) => e.isFree);
    else if (priceRange === "paid") result = result.filter((e) => !e.isFree);
    switch (sortBy) {
      case "date":
        result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case "popularity":
        result.sort((a, b) => b.views - a.views);
        break;
      case "price-asc":
        result.sort((a, b) => (a.lowestPrice ?? 0) - (b.lowestPrice ?? 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0));
        break;
    }
    return result;
  }, [search, selectedCategory, selectedCity, priceRange, sortBy]);

  const hasActiveFilters = selectedCategory || selectedCity || priceRange !== "all";
  const activeFilterCount = [selectedCategory, selectedCity, priceRange !== "all" ? "p" : ""].filter(Boolean).length;

  const FiltersPanel = ({ mobile }: { mobile?: boolean }) => (
    <div className={cn("space-y-5", mobile && "p-0.5")}>
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          Recherche
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Nom, description, mot-clé…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          Catégorie
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200",
              !selectedCategory
                ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            )}
          >
            Toutes
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                selectedCategory === cat.slug
                  ? "text-white shadow-[var(--shadow-sm)]"
                  : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
              )}
              style={selectedCategory === cat.slug ? { backgroundColor: cat.color } : undefined}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          Ville
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] outline-none appearance-none transition-all duration-200 focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
          >
            <option value="">Toutes les villes</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          Prix
        </label>
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tous" },
            { value: "free", label: "Gratuit" },
            { value: "paid", label: "Payant" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriceRange(opt.value)}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200",
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
        {/* Hero header */}
        <section className="relative pt-6 pb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--brand)]/4 blur-[120px] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent)]/4 blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            >
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <Sparkles className="w-3 h-3" />
                {filteredEvents.length} événement{filteredEvents.length !== 1 ? "s" : ""} trouvé{filteredEvents.length !== 1 ? "s" : ""}
              </span>

              <h1 className="text-[28px] md:text-4xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-5">
                Explorer les événements
              </h1>
            </motion.div>

            {/* Quick filters row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
            >
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-container-touch pb-1">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 shrink-0",
                    hasActiveFilters
                      ? "border-[var(--brand)]/30 bg-[var(--brand-subtle)] text-[var(--brand-text)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]"
                  )}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filtres
                  {hasActiveFilters && (
                    <span className="w-4.5 h-4.5 rounded-full bg-[var(--brand)] text-white text-[9px] flex items-center justify-center font-bold ml-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 shrink-0 whitespace-nowrap",
                      selectedCategory === cat.slug
                        ? "text-white shadow-[var(--shadow-sm)]"
                        : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]"
                    )}
                    style={selectedCategory === cat.slug ? { backgroundColor: cat.color } : undefined}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex gap-8">
            {/* Sidebar filters — desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-sm text-[var(--text)]">Filtres</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={() => { setSelectedCategory(""); setSelectedCity(""); setPriceRange("all"); }}
                      className="text-xs text-[var(--brand)] font-medium hover:text-[var(--brand-hover)] transition-colors"
                    >
                      Tout effacer
                    </button>
                  )}
                </div>
                <FiltersPanel />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Sort & view toggles */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--text)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1 bg-[var(--border-subtle)] rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200",
                      viewMode === "grid" ? "bg-[var(--surface)] shadow-[var(--shadow-sm)] text-[var(--text)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200",
                      viewMode === "list" ? "bg-[var(--surface)] shadow-[var(--shadow-sm)] text-[var(--text)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active filter badges */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 mb-4 flex-wrap overflow-hidden"
                  >
                    {selectedCategory && (
                      <Badge variant="soft" className="flex items-center gap-1.5 px-2.5 py-1">
                        {CATEGORIES.find((c) => c.slug === selectedCategory)?.icon}{" "}
                        {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                        <button onClick={() => setSelectedCategory("")} className="hover:text-[var(--text)] transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedCity && (
                      <Badge variant="soft" className="flex items-center gap-1.5 px-2.5 py-1">
                        <MapPin className="w-3 h-3" />
                        {selectedCity}
                        <button onClick={() => setSelectedCity("")} className="hover:text-[var(--text)] transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {priceRange !== "all" && (
                      <Badge variant="soft" className="flex items-center gap-1.5 px-2.5 py-1">
                        {priceRange === "free" ? "Gratuit" : "Payant"}
                        <button onClick={() => setPriceRange("all")} className="hover:text-[var(--text)] transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Events grid */}
              <AnimatePresence mode="wait">
                {filteredEvents.length > 0 ? (
                  <motion.div
                    key={viewMode + filteredEvents.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                        : "space-y-4"
                    )}
                  >
                    {filteredEvents.map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.03, ease: [0.25, 0.1, 0, 1] }}
                      >
                        <EventCard event={event} variant={viewMode === "list" ? "compact" : "standard"} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
                  className="text-center py-20"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1], delay: 0.1 }}
                    className="w-20 h-20 rounded-2xl bg-[var(--border-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5"
                  >
                    <Search className="w-8 h-8 text-[var(--text-tertiary)]" />
                  </motion.div>
                  <h3 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
                    Rien par ici…
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm mx-auto leading-relaxed">
                    On a fouillé partout, mais aucun événement ne correspond à ta recherche. Essaye d&apos;autres filtres, change de ville ou explore toutes les catégories.
                  </p>
                  <div className="flex items-center gap-3 justify-center flex-wrap">
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-full px-5"
                      onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedCity(""); setPriceRange("all"); }}
                    >
                      Réinitialiser les filtres
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/">Page d&apos;accueil</Link>
                    </Button>
                  </div>
                </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
              className="absolute bottom-0 left-0 right-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow-lg)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-[var(--text)]">Filtres</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-8 h-8 rounded-lg bg-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
              </div>
              <FiltersPanel mobile />
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Voir {filteredEvents.length} résultat{filteredEvents.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </>
  );
}
