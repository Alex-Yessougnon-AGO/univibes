"use client";

import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { MapPin, Calendar, Check, ChevronLeft, Sparkles, Globe, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { ORGANIZERS, EVENTS } from "@/lib/mock-data";
import { formatFullDate } from "@/lib/utils";

export default function OrganizerPage() {
  const params = useParams();
  const organizer = ORGANIZERS.find((o) => o.slug === params.slug);

  if (!organizer) notFound();

  const organizerEvents = EVENTS.filter((e) => e.organizer.id === organizer.id);
  const upcomingEvents = organizerEvents.filter((e) => new Date(e.startDate) > new Date());
  const pastEvents = organizerEvents.filter((e) => new Date(e.startDate) <= new Date());

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Cover & Profile */}
        <section className="relative pt-6 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--brand)]/4 blur-[120px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
            >
              <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors mb-6 group">
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                Retour aux événements
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="flex flex-col md:flex-row items-start gap-6"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-[var(--surface)] shadow-[var(--shadow-md)] shrink-0">
                <Image src={organizer.logoUrl} alt={organizer.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{organizer.name}</h1>
                  {organizer.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--brand-subtle)] text-[var(--brand-text)] text-[11px] font-semibold border border-[var(--brand)]/15">
                      <Check className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-2xl leading-relaxed">
                  {organizer.description}
                </p>
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <Calendar className="w-3.5 h-3.5 text-[var(--brand)]" />
                    <span>{organizer.eventsCount} événements</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="font-semibold text-[var(--text)]">{organizer.followersCount.toLocaleString()}</span>
                    abonnés
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <Button variant="primary" size="sm" className="rounded-full">Suivre</Button>
                  <Button variant="outline" size="sm" className="rounded-full gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Site web
                  </Button>
                  <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full border border-[var(--border)]">
                    <Instagram className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Events */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 space-y-12"
        >
          {upcomingEvents.length > 0 && (
            <motion.section variants={fadeUp}>
              <h2 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-5">
                Événements à venir
                <span className="text-sm text-[var(--text-secondary)] font-normal ml-2">({upcomingEvents.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: [0.25, 0.1, 0, 1] }}
                  >
                    <EventCard event={event} variant="standard" />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {pastEvents.length > 0 && (
            <motion.section variants={fadeUp}>
              <h2 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-5">
                Événements passés
                <span className="text-sm text-[var(--text-secondary)] font-normal ml-2">({pastEvents.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.slice(0, 3).map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: [0.25, 0.1, 0, 1] }}
                  >
                    <EventCard event={event} variant="standard" />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </motion.div>
      </main>
      <BottomNav />
    </>
  );
}
