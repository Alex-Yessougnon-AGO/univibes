"use client";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ViewTransition } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Calendar, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatShortDate, formatTime, formatCurrency } from "@/lib/utils";
import { CategoryChip } from "@/components/shared/category-chip";
import type { Event } from "@/lib/mock-data";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  variant?: "featured" | "standard" | "compact";
  className?: string;
  priority?: boolean;
}

export function EventCard({ event, variant = "standard", className, priority = false }: EventCardProps) {
  const [favorited, setFavorited] = useState(event.isFavorited);

  if (variant === "compact") {
    return (
      <Link href={`/event/${event.slug}`} transitionTypes={["nav-forward"]} className={cn("group flex gap-3 p-3 rounded-xl hover:bg-[var(--border-subtle)] transition-colors", className)}>
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <Image src={event.coverImage} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <CategoryChip category={event.category} size="sm" />
          <p className="font-semibold text-sm text-[var(--text)] mt-1 line-clamp-2">{event.title}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatShortDate(event.startDate)} · {formatTime(event.startDate)}
          </p>
          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {event.city}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/event/${event.slug}`}
        transitionTypes={["nav-forward"]}
        className={cn(
          "group relative block rounded-2xl overflow-hidden card-hover",
          "aspect-[16/10] min-w-[300px] md:min-w-[400px]",
          className
        )}
      >
        <ViewTransition name={`event-${event.slug}`} share="morph">
          <Image src={event.coverImage} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority={priority} />
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button
          onClick={(e) => { e.preventDefault(); setFavorited(!favorited); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={cn("w-4 h-4 transition-colors", favorited ? "fill-red-500 text-red-500" : "text-white")} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <CategoryChip category={event.category} size="sm" />
          <h3 className="mt-1.5 text-white font-bold text-lg line-clamp-2 leading-tight">{event.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3 text-white/80 text-xs">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatShortDate(event.startDate)}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.city}</span>
            </div>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-bold",
              event.isFree ? "bg-[var(--accent)] text-white" : "bg-[var(--gold)] text-white"
            )}>
              {event.isFree ? "Gratuit" : `dès ${formatCurrency(event.lowestPrice ?? 0)}`}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Standard card
  return (
    <motion.div
      className={cn("group card-base overflow-hidden", className)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.8 }}
      style={{ willChange: "transform" }}
    >
      <Link href={`/event/${event.slug}`} transitionTypes={["nav-forward"]} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <ViewTransition name={`event-${event.slug}`} share="morph">
            <Image src={event.coverImage} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority={priority} />
          </ViewTransition>
          <div className="absolute top-3 left-3">
            <CategoryChip category={event.category} size="sm" />
          </div>
          <button
            onClick={(e) => { e.preventDefault(); setFavorited(!favorited); }}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              "backdrop-blur-sm border",
              favorited
                ? "bg-red-500/90 border-red-400 text-white"
                : "bg-white/80 dark:bg-black/40 border-white/50 text-gray-600 hover:bg-white hover:text-red-500"
            )}
            aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={cn("w-4 h-4 transition-colors", favorited && "fill-current")} />
          </button>
        </div>
        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-[var(--text)] text-sm leading-tight line-clamp-2 mb-2">{event.title}</h3>
          <div className="space-y-1 text-xs text-[var(--text-secondary)]">
            <p className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
              {formatShortDate(event.startDate)} à {formatTime(event.startDate)}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
              <span className="truncate">{event.location}, {event.city}</span>
            </p>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                <Image src={event.organizer.logoUrl} alt={event.organizer.name} width={24} height={24} className="object-cover" />
              </div>
              <span className="text-xs text-[var(--text-secondary)] truncate">{event.organizer.name}</span>
            </div>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-bold shrink-0",
              event.isFree
                ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                : "bg-[var(--gold-subtle)] text-[var(--gold)]"
            )}>
              {event.isFree ? "Gratuit" : formatCurrency(event.lowestPrice ?? 0)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
