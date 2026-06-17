"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "fr", label: "nav.french" },
  { code: "en", label: "nav.english" },
] as const;

export function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  const currentLabel = locale === "fr" ? "FR" : "EN";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)] transition-colors text-xs font-semibold tracking-wide"
        aria-label={t("nav.language")}
        aria-expanded={open}
      >
        <Languages className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 min-w-[140px] rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] p-1 z-50">
          {LOCALES.map((l) => {
            const active = locale === l.code;
            return (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--brand-subtle)] text-[var(--brand-text)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)]"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase opacity-60">{l.code}</span>
                  <span>{t(l.label)}</span>
                </span>
                {active && <Check className="w-3.5 h-3.5 text-[var(--brand)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
