"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Calendar, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EVENTS } from "@/lib/mock-data";
import { formatShortDate } from "@/lib/utils";

export default function ModeratorEventsPage() {
  const pendingEvents = EVENTS.filter((e) => !e.isFavorited);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center shadow-[var(--shadow-brand)]">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-[family-name:var(--font-display)] text-base text-[var(--text)] tracking-tight">Modération</span>
          </div>
          <Link href="/" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">Voir le site</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
            <ShieldCheck className="w-3 h-3" />
            File de modération
          </span>
          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-1">Événements en attente</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">{pendingEvents.length} événement{pendingEvents.length > 1 ? "s" : ""} à valider</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          className="space-y-4"
        >
          {pendingEvents.map((event) => (
            <motion.div
              key={event.id}
              variants={fadeUp}
              className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col sm:flex-row gap-4 shadow-[var(--shadow-sm)]"
            >
              <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">{event.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {event.organizer.name} · {event.category.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatShortDate(event.startDate)}</span>
                      <span>{event.city}</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Badge variant="warning">En attente</Badge>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-2 line-clamp-2 leading-relaxed">{event.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">Approuver</Button>
                  <Button variant="danger" size="sm">Refuser</Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/event/${event.slug}`}>Prévisualiser</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
