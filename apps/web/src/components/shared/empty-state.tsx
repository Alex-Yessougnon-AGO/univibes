import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Boutons d'action (primaire + secondaire) */
  actions?: ReactNode;
  /** Version compacte pour panneaux latéraux / cartes */
  compact?: boolean;
  className?: string;
}

/**
 * État vide unique — jamais un simple "Aucun résultat".
 * Toujours : icône douce + titre + explication + action.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "py-10 px-6" : "py-16 md:py-24 px-6",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-[1.25rem] bg-[var(--brand-subtle)] border border-[var(--brand)]/10 mb-6",
          compact ? "w-14 h-14" : "w-[72px] h-[72px]"
        )}
      >
        <Icon
          className={cn("text-[var(--brand)]", compact ? "w-6 h-6" : "w-8 h-8")}
          aria-hidden="true"
        />
      </div>
      <h3
        className={cn(
          "font-bold tracking-tight text-[var(--text)] text-balance",
          compact ? "text-base" : "text-xl md:text-2xl"
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "text-[var(--text-secondary)] leading-relaxed mt-2 max-w-sm text-balance",
            compact ? "text-[13px]" : "text-sm md:text-[15px]"
          )}
        >
          {description}
        </p>
      )}
      {actions && (
        <div className="flex items-center gap-3 mt-7 flex-wrap justify-center">
          {actions}
        </div>
      )}
    </div>
  );
}
