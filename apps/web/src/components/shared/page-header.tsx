import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Petit label uppercase (nom de l'espace : Dashboard, Admin…) */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Actions à droite (bouton créer, filtres…) */
  actions?: ReactNode;
  className?: string;
}

/**
 * En-tête des pages applicatives (dashboard, admin, modérateur,
 * profil, tickets…). Même respiration partout : titre Inter tight,
 * description courte, actions alignées.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8 md:mb-10",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h1 className="h-section !text-[26px] md:!text-[32px] text-[var(--text)]">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-[15px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
