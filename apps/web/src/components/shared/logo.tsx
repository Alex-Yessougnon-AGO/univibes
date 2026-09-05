import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Affiche le nom à côté du monogramme */
  withWordmark?: boolean;
  /** Taille du monogramme */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-[13px] rounded-[10px]",
  md: "w-9 h-9 text-sm rounded-xl",
  lg: "w-11 h-11 text-base rounded-2xl",
} as const;

/**
 * Logo unique Univibes — UNE seule signature sur tout le produit.
 * Monogramme "UV" violet + wordmark Inter extrabold.
 */
export function Logo({ withWordmark = true, size = "md", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex items-center justify-center bg-[var(--brand)] font-black text-white shadow-[var(--shadow-brand)] shrink-0",
          sizes[size]
        )}
        aria-hidden="true"
      >
        UV
      </span>
      {withWordmark && (
        <span className="font-extrabold tracking-tight text-[var(--text)] text-lg leading-none">
          Univibes
        </span>
      )}
    </span>
  );
}

export function LogoLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 rounded-xl", className)}
      aria-label="Univibes — accueil"
    >
      <Logo />
    </Link>
  );
}
