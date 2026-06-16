"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Calendar, MapPin, TrendingUp, Users, ChevronRight, Bell } from "lucide-react";
import { CategoryIcon } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { EVENTS, ORGANIZERS, CATEGORIES, CITIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const RECOMMENDED = EVENTS.filter((e) => e.views > 5000 || e.isFavorited).slice(0, 8);
const NEARBY = EVENTS.filter((e) => e.city === "Abomey-Calavi").slice(0, 4);
const TRENDING_CATEGORIES = CATEGORIES.slice(0, 4);

export default function StudentHomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Hero greeting */}
        <section className="relative pt-8 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[var(--brand)]/4 blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
                    <Sparkles className="w-3 h-3" />
                    Ton fil d&apos;actualité
                  </span>
                  <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
                    Salut, Alex 👋
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Découvre les événements recommandés pour toi
                  </p>
                </div>
                <Link
                  href="/notifications"
                  className="relative w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
                >
                  <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">3</span>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--surface)] overflow-hidden">
                      <Image src={`https://picsum.photos/seed/friend${i}/100/100`} alt="" width={32} height={32} className="object-cover" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--surface)] bg-[var(--brand-subtle)] flex items-center justify-center text-[10px] font-bold text-[var(--brand-text)]">
                    +3
                  </div>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">
                  <strong className="text-[var(--text)] font-semibold">4 amis</strong> y participent cette semaine
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 space-y-12">
          {/* Trending categories */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="font-semibold text-sm text-[var(--text)]">Tendances</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-container-touch pb-1">
              {TRENDING_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/explore?category=${cat.slug}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand)]/20 hover:shadow-[var(--shadow-sm)] transition-all shrink-0"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                    <CategoryIcon name={cat.icon} className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <span className="text-sm font-medium text-[var(--text)] whitespace-nowrap">{cat.name}</span>
                </Link>
              ))}
              <Link
                href="/explore"
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border)] transition-all shrink-0"
              >
                Tout voir <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.section>

          {/* Recommended for you */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.1, 0, 1] }}
          >
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand)]">Recommandés</span>
                <h2 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mt-1">
                  Pour toi
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link href="/explore">Voir tout <ChevronRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {RECOMMENDED.slice(0, 4).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.04, ease: [0.25, 0.1, 0, 1] }}
                >
                  <EventCard event={event} variant="standard" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Near you */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
          >
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand)]">Proximité</span>
                <h2 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mt-1">
                  Près de chez toi
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Abomey-Calavi et environs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {NEARBY.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.04, ease: [0.25, 0.1, 0, 1] }}
                >
                  <EventCard event={event} variant="standard" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* This week's picks — horizontal scroll */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: [0.25, 0.1, 0, 1] }}
          >
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">Cette semaine</span>
                <h2 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mt-1">
                  Les immanquables
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })}
                  className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })}
                  className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-container-touch pb-2 -mx-4 px-4 snap-x snap-mandatory"
            >
              {RECOMMENDED.slice(0, 5).map((event) => (
                <div key={event.id} className="snap-start shrink-0 w-[300px] md:w-[360px]">
                  <EventCard event={event} variant="featured" />
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
