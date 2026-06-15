import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow, isThisWeek } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}K FCFA`;
  return `${amount} FCFA`;
}

export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return `Aujourd'hui à ${format(date, "HH'h'mm", { locale: fr })}`;
  if (isTomorrow(date)) return `Demain à ${format(date, "HH'h'mm", { locale: fr })}`;
  if (isThisWeek(date)) return format(date, "EEEE 'à' HH'h'mm", { locale: fr });
  return format(date, "d MMM yyyy 'à' HH'h'mm", { locale: fr });
}

export function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), "d MMM", { locale: fr });
}

export function formatFullDate(dateStr: string): string {
  return format(new Date(dateStr), "EEEE d MMMM yyyy", { locale: fr });
}

export function formatTime(dateStr: string): string {
  return format(new Date(dateStr), "HH'h'mm", { locale: fr });
}

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr });
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}
