import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  /** Valeur affichée en police display (chiffre clé) */
  value: string;
  icon: LucideIcon;
  /** Variation ex. "+12%" — positif = succès */
  delta?: string;
  /** Sens de la variation */
  trend?: "up" | "down" | "flat";
  /** Sous-texte neutre ex. "vs mois dernier" */
  hint?: string;
  className?: string;
}

/**
 * Carte KPI unique pour tous les dashboards (orga, admin, analytics).
 * Chiffre en Calistoga = un des RARES usages autorisés hors hero.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  trend = "up",
  hint,
  className,
}: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        "card-xl p-6 flex flex-col gap-4 card-hover",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-[var(--brand-subtle)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--brand)]" aria-hidden="true" />
        </div>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums",
              trend === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              trend === "down" && "bg-red-500/10 text-red-500",
              trend === "flat" && "bg-[var(--border-subtle)] text-[var(--text-secondary)]"
            )}
          >
            <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
            {delta}
          </span>
        )}
      </div>
      <div>
        <p className="display text-[32px] leading-none text-[var(--text)] tabular-nums">
          {value}
        </p>
        <p className="text-[13px] text-[var(--text-secondary)] mt-2 font-medium">
          {label}
        </p>
        {hint && (
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{hint}</p>
        )}
      </div>
    </div>
  );
}
