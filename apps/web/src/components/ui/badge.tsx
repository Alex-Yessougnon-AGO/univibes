import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "gold" | "soft" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--brand-subtle)] text-[var(--brand-text)]",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning: "bg-[var(--accent-subtle)] text-[var(--accent)] dark:bg-[var(--accent-subtle)]/20 dark:text-rose-400",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  gold: "bg-[var(--gold-subtle)] text-[var(--gold)]",
  soft: "bg-[var(--border-subtle)] text-[var(--text-secondary)]",
  outline: "border border-[var(--border)] text-[var(--text-secondary)] bg-transparent",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
