"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ViewTransition } from "react";
import { Heart, MapPin, Calendar } from "lucide-react";
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
  /** Unique instance ID to avoid ViewTransition name collisions when rendering multiple cards */
  instanceId?: string;
}

function FavoriteButton({
  favorited,
  onToggle,
  label,
  className,
}: {
  favorited: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      aria-label={label}
      aria-pressed={favorited}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 pressable",
        "backdrop-blur-md border shadow-[var(--shadow-sm)]",
        favorited
          ? "bg-[var(--accent)] border-[var(--accent)] text-white"
          : "bg-white/85 dark:bg-black/50 border-white/60 dark:border-white/10 text-[var(--text)] hover:text-[var(--accent)]",
        className
      )}
    >
      <Heart
        className={cn("w-[18px] h-[18px]", favorited && "fill-current animate-favorite-pop")}
      />
    </button>
  );
}

function PriceTag({ event, onImage = false }: { event: Event; onImage?: boolean }) {
  if (event.isFree) {
    return (
      <span
        className={cn(
          "inline-flex px-3 py-1.5 rounded-full text-xs font-bold",
          onImage
            ? "bg-[var(--accent)] text-white shadow-[var(--shadow-sm)]"
            : "bg-[var(--accent-subtle)] text-[var(--accent)]"
        )}
      >
        Gratuit
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex px-3 py-1.5 rounded-full text-xs font-bold tabular-nums",
        onImage
          ? "bg-white/95 dark:bg-black/70 text-[var(--text)] shadow-[var(--shadow-sm)] backdrop-blur-sm"
          : "bg-[var(--brand-subtle)] text-[var(--brand-text)]"
      )}
    >
      {formatCurrency(event.lowestPrice ?? 0)}
    </span>
  );
}

export function EventCard({ event, variant = "standard", className, priority = false, instanceId }: EventCardProps) {
  const [favorited, setFavorited] = useState(event.isFavorited);
  const t = useTranslations();
  const favLabel = favorited ? t("event.unfavorite") : t("event.favorite");

  /* ── Compact : ligne horizontale aérée (listes, recherche) ── */
  if (variant === "compact") {
    return (
      <Link
        href={`/event/${event.slug}`}
        transitionTypes={["nav-forward"]}
        className={cn(
          "group flex gap-4 p-4 rounded-[1.25rem] card-xl card-hover",
          className
        )}
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0 py-1 flex flex-col">
          <CategoryChip category={event.category} size="sm" />
          <p className="font-bold text-[15px] text-[var(--text)] mt-2 line-clamp-2 leading-snug">
            {event.title}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {formatShortDate(event.startDate)} · {formatTime(event.startDate)}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{event.location}, {event.city}</span>
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end justify-between py-1 shrink-0">
          <FavoriteButton favorited={favorited} onToggle={() => setFavorited(!favorited)} label={favLabel} />
          <PriceTag event={event} />
        </div>
      </Link>
    );
  }

  /* ── Featured : carte héro 16/10, texte sur image ── */
  if (variant === "featured") {
    return (
      <Link
        href={`/event/${event.slug}`}
        transitionTypes={["nav-forward"]}
        className={cn(
          "group relative block rounded-[1.5rem] overflow-hidden card-hover",
          "aspect-[16/10] min-w-[300px] md:min-w-[420px]",
          className
        )}
      >
        <ViewTransition name={`event-${event.slug}${instanceId ? `-${instanceId}` : ""}`} share="morph">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority={priority}
          />
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute top-4 right-4">
          <FavoriteButton favorited={favorited} onToggle={() => setFavorited(!favorited)} label={favLabel} />
        </div>
        <div className="absolute top-4 left-4">
          <CategoryChip category={event.category} size="sm" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <h3 className="text-white font-bold text-lg md:text-xl line-clamp-2 leading-snug tracking-[-0.01em]">
            {event.title}
          </h3>
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-4 text-white/85 text-[13px] font-medium min-w-0">
              <span className="flex items-center gap-1.5 shrink-0">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {formatShortDate(event.startDate)}
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{event.city}</span>
              </span>
            </div>
            <PriceTag event={event} onImage />
          </div>
        </div>
      </Link>
    );
  }

  /* ── Standard : la carte signature — aérée, hiérarchisée ── */
  return (
    <div className={cn("group card-xl overflow-hidden card-interactive flex flex-col", className)}>
      <Link href={`/event/${event.slug}`} transitionTypes={["nav-forward"]} className="block">
        <div className="relative aspect-[16/10] overflow-hidden img-zoom">
          <ViewTransition name={`event-${event.slug}${instanceId ? `-${instanceId}` : ""}`} share="morph">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority={priority}
            />
          </ViewTransition>
          <div className="absolute top-3.5 left-3.5">
            <CategoryChip category={event.category} size="sm" />
          </div>
          <div className="absolute top-3 right-3">
            <FavoriteButton favorited={favorited} onToggle={() => setFavorited(!favorited)} label={favLabel} />
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <h3 className="font-bold text-[var(--text)] text-[15px] leading-snug line-clamp-2 tracking-[-0.01em]">
            {event.title}
          </h3>

          <div className="space-y-1.5 text-[13px] text-[var(--text-secondary)] font-medium">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--brand)] shrink-0" aria-hidden="true" />
              {formatShortDate(event.startDate)} · {formatTime(event.startDate)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--brand)] shrink-0" aria-hidden="true" />
              <span className="truncate">{event.location}, {event.city}</span>
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 mt-1 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                <Image
                  src={event.organizer.logoUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <span className="text-[13px] font-medium text-[var(--text-secondary)] truncate">
                {event.organizer.name}
              </span>
            </div>
            <PriceTag event={event} />
          </div>
        </div>
      </Link>
    </div>
  );
}
