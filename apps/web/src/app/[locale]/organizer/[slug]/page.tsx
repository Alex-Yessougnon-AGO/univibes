"use client";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Check, ChevronLeft, Sparkles, Globe, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { formatFullDate } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { eventsService } from "@/lib/services/events-service";

export default function OrganizerPage() {
  const params = useParams();
  const t = useTranslations();
  useScrollReveal();
  const [organizer, setOrganizer] = useState<any | null>(null);
  const [organizerEvents, setOrganizerEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    if (!slug) return;
    // Fetch events and find the organizer from event data
    eventsService.findAll({ limit: 50, search: slug })
      .then((data: any) => {
        const events = Array.isArray(data) ? data : data?.data ?? [];
        setOrganizerEvents(events);
        if (events.length > 0 && events[0].organizer) {
          setOrganizer(events[0].organizer);
        }
      })
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)]">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--brand)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!organizer) notFound();

  const upcomingEvents = organizerEvents.filter((e: any) => new Date(e.startDate) > new Date());
  const pastEvents = organizerEvents.filter((e: any) => new Date(e.startDate) <= new Date());

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Cover & Profile */}
        <section className="relative pt-6 pb-16 overflow-hidden reveal">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--brand)]/4 blur-[120px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <div
              >
              <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors mb-6 group">
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                {t("common.back")} {t("common.toEvents")}
              </Link>
            </div>

            <div
              className="flex flex-col md:flex-row items-start gap-6"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-[var(--surface)] shadow-[var(--shadow-md)] shrink-0 card-hover">
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
                    <span>{t("event.eventsCount", { count: organizer.eventsCount })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="font-semibold text-[var(--text)]">{organizer.followersCount.toLocaleString()}</span>
                    {t("event.followers")}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <Button variant="primary" size="sm" className="rounded-full pressable">Suivre</Button>
                  <Button variant="outline" size="sm" className="rounded-full gap-1.5 pressable">
                    <Globe className="w-3.5 h-3.5" />
                    Site web
                  </Button>
                  <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full border border-[var(--border)] pressable">
                    <Instagram className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events */}
        <div
         
         
          
          className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 space-y-12"
        >
          {upcomingEvents.length > 0 && (
            <section className="reveal">
              <h2 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-5">
                {t("ticket.upcoming")}
                <span className="text-sm text-[var(--text-secondary)] font-normal ml-2">({upcomingEvents.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event, i) => (
                  <div
                    key={event.id}
                    >
                    <EventCard event={event} variant="standard" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {pastEvents.length > 0 && (
            <section className="reveal">
              <h2 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-5">
                {t("ticket.past")}
                <span className="text-sm text-[var(--text-secondary)] font-normal ml-2">({pastEvents.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.slice(0, 3).map((event, i) => (
                  <div
                    key={event.id}
                    >
                    <EventCard event={event} variant="standard" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
