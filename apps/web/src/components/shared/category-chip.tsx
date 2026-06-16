import { cn } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icon-map";
import type { EventCategory } from "@/lib/mock-data";

interface CategoryChipProps {
  category: EventCategory;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryChip({ category, size = "md", className }: CategoryChipProps) {
  const Icon = getCategoryIcon(category.icon);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs",
        "text-white",
        className
      )}
      style={{ backgroundColor: category.color }}
    >
      <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      {category.name}
    </span>
  );
}

interface CategoryGridProps {
  categories: EventCategory[];
  selected?: string;
  onSelect?: (slug: string) => void;
}

export function CategoryGrid({ categories, selected, onSelect }: CategoryGridProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect?.("")}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all",
          !selected
            ? "bg-[var(--brand)] text-white shadow-[var(--shadow-brand)]"
            : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
        )}
      >
        Tous
      </button>
      {categories.map((cat) => {
        const CatIcon = getCategoryIcon(cat.icon);
        return (
          <button
            key={cat.id}
            onClick={() => onSelect?.(cat.slug)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
              selected === cat.slug
                ? "text-white shadow-sm"
                : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            )}
            style={selected === cat.slug ? { backgroundColor: cat.color } : undefined}
          >
            <CatIcon className="w-3.5 h-3.5" />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
