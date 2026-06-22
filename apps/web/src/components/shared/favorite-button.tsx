"use client";
import { useState } from "react";
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !favorited;
    setFavorited(next);
    onToggle?.(next);
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
        {/* Key remounts the wrapper on each toggle to replay the CSS animation */}
        <div key={String(favorited)} className="animate-favorite-pop">
          <Heart
            className={cn(
              size === "sm" ? "w-4 h-4" : "w-[18px] h-[18px]",
              favorited
                ? "fill-red-500 text-red-500"
                : variant === "overlay" ? "text-white" : "text-gray-600 dark:text-gray-300"
            )}
          />
        </div>
      </div>
    </button>
  );
}
