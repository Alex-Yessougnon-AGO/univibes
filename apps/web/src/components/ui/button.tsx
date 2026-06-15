"use client";
import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "accent" | "gold" | "outline" | "ghost" | "danger" | "soft";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-[var(--shadow-brand)] hover:shadow-[0_6px_20px_rgba(122,77,58,0.35)]",
  accent: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[var(--shadow-accent)]",
  gold: "bg-[var(--gold)] text-white hover:bg-[var(--gold-hover)] shadow-[var(--shadow-accent)]",
  outline: "border border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--border-subtle)]",
  ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--border-subtle)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
  soft: "bg-[var(--brand-subtle)] text-[var(--brand-text)] hover:bg-[var(--brand-subtle)]/80",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs rounded-lg",
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, loading, disabled, leftIcon, rightIcon, children, ...props }, ref) => {
    // When asChild is true, Slot must receive exactly one React element child
    // so we cannot render leftIcon/rightIcon/loader alongside children
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,box-shadow,opacity] duration-150 cursor-pointer select-none",
            "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
            "focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2",
            variantStyles[variant],
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const motionProps: HTMLMotionProps<"span"> = {
      whileHover: !disabled && !loading ? { scale: 1.02 } : undefined,
      whileTap: !disabled && !loading ? { scale: 0.97 } : undefined,
      transition: { type: "spring", stiffness: 400, damping: 17, mass: 0.5 },
    };

    return (
      <motion.span {...motionProps} style={{ display: "inline-flex" }}>
        <button
          ref={ref}
          disabled={disabled || loading}
          className={cn(
            "inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,box-shadow,opacity] duration-150 cursor-pointer select-none",
            "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
            "focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2",
            variantStyles[variant],
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
          {children}
          {!loading && rightIcon}
        </button>
      </motion.span>
    );
  }
);
Button.displayName = "Button";
