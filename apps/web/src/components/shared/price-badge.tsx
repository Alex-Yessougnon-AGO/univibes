import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface PriceBadgeProps {
  isFree: boolean;
  price?: number;
  className?: string;
  variant?: "pill" | "tag";
}

export function PriceBadge({ isFree, price, className, variant = "pill" }: PriceBadgeProps) {
  const base = variant === "pill"
    ? "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
    : "inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold";
  return (
    <span
      className={cn(
        base,
        isFree
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-[var(--gold-subtle)] text-[var(--gold)]",
        className
      )}
    >
      {isFree ? "Gratuit" : `À partir de ${formatCurrency(price ?? 0)}`}
    </span>
  );
}
