import {
  Music,
  Mic,
  Sparkles,
  Code,
  Trophy,
  Palette,
  Handshake,
  GlassWater,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconRegistry: Record<string, LucideIcon> = {
  music: Music,
  mic: Mic,
  sparkles: Sparkles,
  code: Code,
  trophy: Trophy,
  palette: Palette,
  handshake: Handshake,
  "glass-water": GlassWater,
};

export function getCategoryIcon(name: string): LucideIcon {
  return iconRegistry[name] ?? Sparkles;
}

/** Renders a category icon from its string name — use this in JSX instead of IIFE patterns. */
export function CategoryIcon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = getCategoryIcon(name);
  return <Icon className={cn("shrink-0", className)} style={style} />;
}
