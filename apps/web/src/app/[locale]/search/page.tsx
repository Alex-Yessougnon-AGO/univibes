"use client";
import { useTranslations } from "next-intl";

import { useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { Search as SearchIcon, X, MapPin, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";
import { eventsService, categoriesService } from "@/lib/services/events-service";

const CITIES_LIST = ["Cotonou", "Abomey-Calavi", "Porto-Novo", "Parakou", "Lokossa"];

export default function SearchPage() {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      eventsService.findAll({ limit: 100 }),
      categoriesService.findAll(),
    ]).then(([eventsData, catsData]) => {
      setAllEvents(Array.isArray(eventsData) ? eventsData : (eventsData as any)?.data ?? []);
      setCategories(catsData);
    }).catch(() => {});
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allEvents.filter((e: any) =>
      (e.title || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q) ||
      (e.organizer?.name || '').toLowerCase().includes(q) ||
      (e.tags?.some((t: string) => t.toLowerCase().includes(q)))
    ).filter((e: any) => !selectedCategory || e.category?.slug === selectedCategory);
  }, [query, selectedCategory, allEvents]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-8 pb-6 overflow-hidden reveal">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 reveal">
            <div  >
              <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-5 reveal">{t("common.search")}</h1>
              <div className="relative reveal">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] reveal" />
                <input
                  type="text"
                  placeholder={t("explore.searchPlaceholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-full h-12 pl-10 pr-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] reveal"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 reveal">
                    <X className="w-4 h-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] reveal" />
                  </button>
                )}
              </div>

              {query && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1 reveal">
                  {categories.slice(0, 8).map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                      className={cn(
                        "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        selectedCategory === cat.slug
                          ? "bg-[var(--brand)] text-white"
                          : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 reveal">
          <div >
            {!query ? (
              <div key="empty"   className="text-center py-16 reveal">
                <div className="w-16 h-16 rounded-2xl bg-[var(--border-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4 reveal">
                  <SearchIcon className="w-7 h-7 text-[var(--text-tertiary)] reveal" />
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-1 reveal">{t("explore.searchPlaceholder")}</h3>
                <p className="text-sm text-[var(--text-secondary)] reveal">{t("explore.noResults")}</p>
              </div>
            ) : results.length === 0 ? (
              <div key="noresults"   className="text-center py-16 reveal">
                <h3 className="font-semibold text-[var(--text)] mb-1 reveal">{t("common.noResults")}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 reveal">{t("explore.noResultsDesc")}</p>
                <Button variant="outline" size="sm" onClick={() => { setQuery(""); setSelectedCategory(""); }}>{t("explore.resetFilters")}</Button>
              </div>
            ) : (
              <div key="results"   className="space-y-4 reveal pressable">
                <div className="flex items-center gap-2 mb-4 reveal pressable">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--brand)] reveal pressable" />
                  <span className="text-xs text-[var(--text-secondary)] reveal pressable">{t("explore.results", { count: results.length })}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal pressable">
                  {results.map((event) => (
                    <EventCard key={event.id} event={event} variant="standard" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
