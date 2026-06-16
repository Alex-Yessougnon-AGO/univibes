"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, MapPin, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { EVENTS, CATEGORIES, CITIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return EVENTS.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.organizer.name.toLowerCase().includes(q) ||
      e.tags?.some((t) => t.toLowerCase().includes(q))
    ).filter((e) => !selectedCategory || e.category.slug === selectedCategory);
  }, [query, selectedCategory]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-8 pb-6 overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-5">Recherche</h1>
              <div className="relative">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  placeholder="Rechercher un événement, un organisateur..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-full h-12 pl-10 pr-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]" />
                  </button>
                )}
              </div>

              {query && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                  {CATEGORIES.slice(0, 8).map((cat) => (
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
            </motion.div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <AnimatePresence mode="wait">
            {!query ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-[var(--border-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-7 h-7 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-1">Que cherches-tu ?</h3>
                <p className="text-sm text-[var(--text-secondary)]">Tape un mot-clé pour trouver des événements, organisateurs ou catégories.</p>
              </motion.div>
            ) : results.length === 0 ? (
              <motion.div key="noresults" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-16">
                <h3 className="font-semibold text-[var(--text)] mb-1">Aucun résultat</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Essayez d&apos;autres mots-clés.</p>
                <Button variant="outline" size="sm" onClick={() => setQuery("")}>Réinitialiser</Button>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span className="text-xs text-[var(--text-secondary)]">{results.length} résultat{results.length > 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((event) => (
                    <EventCard key={event.id} event={event} variant="standard" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
