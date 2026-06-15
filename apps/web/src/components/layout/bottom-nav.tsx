"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Ticket, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/explore", icon: Search, label: "Explorer" },
  { href: "/tickets", icon: Ticket, label: "Billets" },
  { href: "/favorites", icon: Heart, label: "Favoris" },
  { href: "/profile", icon: User, label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-[var(--border)] safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              transitionTypes={["nav-forward"]}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-w-[52px] relative",
                active
                  ? "text-[var(--brand)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: active ? 1 : 0.85, opacity: active ? 1 : 0.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, mass: 0.5 }}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </motion.div>
                {active && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[var(--brand)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <motion.span
                className="text-[10px] font-medium leading-none"
                animate={{ fontWeight: active ? 600 : 500 }}
              >
                {label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
