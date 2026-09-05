import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** Petit label uppercase au-dessus du titre */
  eyebrow?: ReactNode;
  /** Titre de section — Inter 700 tight (JAMAIS Calistoga) */
  title: ReactNode;
  /** Description courte, une ligne idéalement */
  description?: ReactNode;
  /** Action à droite (lien "Tout voir", boutons…) — desktop */
  action?: ReactNode;
  /** Centré (landing) ou aligné gauche (catalogues) */
  align?: "left" | "center";
  className?: string;
}

/**
 * En-tête de section standard — LA pièce maîtresse de la cohérence.
 * Chaque section du produit utilise ce composant : même rythme,
 * même hiérarchie, zéro improvisation.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl",
        action && align === "left" && "md:flex md:items-end md:justify-between md:gap-8 md:max-w-none",
        className
      )}
    >
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="h-section text-[var(--text)]">{title}</h2>
        {description && (
          <p className="lead mt-3 !text-[15px]">{description}</p>
        )}
      </div>
      {action && <div className="mt-5 md:mt-0 shrink-0">{action}</div>}
    </div>
  );
}
