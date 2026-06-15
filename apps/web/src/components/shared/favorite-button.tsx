"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  initialFavorited?: boolean;
  onToggle?: (favorited: boolean) => void;
  className?: string;
  variant?: "standard" | "ghost" | "overlay";
  size?: "sm" | "md";
}

export function FavoriteButton({
  initialFavorited = false,
  onToggle,
  className,
  variant = "overlay",
  size = "md",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !favorited;
    setFavorited(next);
    setIsAnimating(true);
    onToggle?.(next);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-9 h-9";

  const baseClasses = cn(
    "rounded-full flex items-center justify-center transition-colors",
    sizeClasses,
    variant === "overlay" && "bg-white/20 backdrop-blur-sm hover:bg-white/30",
    variant === "standard" && "bg-white/80 dark:bg-black/40 border border-white/50 hover:bg-white hover:text-red-500",
    variant === "ghost" && "hover:bg-[var(--border-subtle)]",
  );

  return (
    <button
      onClick={handleClick}
      className={cn(baseClasses, className)}
      aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          key={favorited ? "filled" : "empty"}
          initial={isAnimating ? { scale: 0.6, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.5 }}
        >
          <Heart
            className={cn(
              size === "sm" ? "w-4 h-4" : "w-[18px] h-[18px]",
              favorited
                ? "fill-red-500 text-red-500"
                : variant === "overlay" ? "text-white" : "text-gray-600 dark:text-gray-300"
            )}
          />
        </motion.div>
      </div>
    </button>
  );
}
