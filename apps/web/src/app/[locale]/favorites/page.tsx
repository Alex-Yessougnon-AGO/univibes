"use client";
import { useTranslations } from "next-intl";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Heart, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useAuth } from "@/lib/auth-context";
import { favoritesService } from "@/lib/services/user-service";

export default function FavoritesPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    favoritesService.findAll()
      .then((data: any) => {
        setFavorites(Array.isArray(data) ? data : []);
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-8 pb-12 overflow-hidden reveal">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <div
              >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30 text-[11px] font-semibold text-rose-600 dark:text-rose-400 tracking-wide mb-4">
                <Heart className="w-3 h-3" />
                {t("nav.favorites")}
              </span>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
                    {t("nav.favorites")}
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                    {favorites.length} événement{favorites.length !== 1 ? "s" : ""} sauvegardé{favorites.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {favorites.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 pressable"
                    onClick={() => setFavorites([])}
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("common.delete")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 reveal">
          {favorites.length > 0 ? (
            <div
              
             
             
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {favorites.map((event) => (
                <div key={event.id} >
                  <EventCard event={event} variant="standard" />
                </div>
              ))}
            </div>
          ) : (              <div
                className="text-center py-20"
              >
                <div
                  className="w-20 h-20 rounded-2xl bg-rose-50 dark:bg-rose-950/10 flex items-center justify-center mx-auto mb-5 border border-rose-200/50 dark:border-rose-800/20 card-hover"
                >
                  <Heart className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
                  {t("explore.noResults")}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-7 max-w-sm mx-auto leading-relaxed">
                  Parcours les événements et tape sur le <Heart className="w-3.5 h-3.5 inline -mt-0.5 text-rose-400" /> pour sauvegarder ceux qui te font vibrer. Ils t&apos;attendent ici.
                </p>
                <Button variant="primary" size="md" className="rounded-full px-6 pressable" asChild>
                  <Link href="/explore">{t("home.discoverEvents")}</Link>
                </Button>
              </div>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
