"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

const ARTICLES = [
  {
    slug: "comment-creer-un-evenement-etudiant-reussi",
    title: "Comment créer un événement étudiant réussi ?",
    excerpt: "Guide complet pour organiser un événement qui cartonne sur ton campus : de la conception à la promotion.",
    author: "Alex Koffi",
    date: "12 juin 2025",
    category: "Conseils",
    image: "https://picsum.photos/seed/blog1/800/400",
    readTime: "5 min",
  },
  {
    slug: "top-10-des-evenements-a-ne-pas-manquer-cette-annee",
    title: "Top 10 des événements à ne pas manquer cette année",
    excerpt: "On a sélectionné pour toi les événements les plus prometteurs de l'année universitaire sur les campus béninois.",
    author: "Mariam Diallo",
    date: "8 juin 2025",
    category: "Sélections",
    image: "https://picsum.photos/seed/blog2/800/400",
    readTime: "4 min",
  },
  {
    slug: "comment-booster-sa-visibilite-sur-univibes",
    title: "Comment booster la visibilité de ton événement sur UnivVibes",
    excerpt: "Les meilleures pratiques pour faire décoller ton événement grâce aux outils de promotion UnivVibes.",
    author: "UnivVibes Team",
    date: "2 juin 2025",
    category: "Organisateurs",
    image: "https://picsum.photos/seed/blog3/800/400",
    readTime: "6 min",
  },
  {
    slug: "pourquoi-la-billetterie-en-ligne-est-essentielle",
    title: "Pourquoi la billetterie en ligne est essentielle pour tes événements",
    excerpt: "Fini les listes WhatsApp et les cash à l'entrée. Découvre pourquoi la billetterie digitale change la donne.",
    author: "UnivVibes Team",
    date: "28 mai 2025",
    category: "Billetterie",
    image: "https://picsum.photos/seed/blog4/800/400",
    readTime: "4 min",
  },
  {
    slug: "interview-d-un-organisateur-qui-cartonne",
    title: "Interview : Comment ce club étudiant a rempli sa salle en 48h",
    excerpt: "Retour d'expérience du Club Culturel UAC qui a vendu 200 billets en deux jours grâce à UnivVibes.",
    author: "Alex Koffi",
    date: "20 mai 2025",
    category: "Témoignages",
    image: "https://picsum.photos/seed/blog5/800/400",
    readTime: "7 min",
  },
];

export default function BlogPage() {
  const t = useTranslations();
  const CATEGORIES = [t("blog.cat_all"), t("blog.cat_tips"), t("blog.cat_orga"), t("blog.cat_ticket"), t("blog.cat_testi"), t("blog.cat_select")];
  const CATEGORY_MAP: Record<string, string> = {
    "Conseils": t("blog.cat_tips"),
    "Sélections": t("blog.cat_select"),
    "Organisateurs": t("blog.cat_orga"),
    "Billetterie": t("blog.cat_ticket"),
    "Témoignages": t("blog.cat_testi"),
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-12 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                <Sparkles className="w-3 h-3" />
                {t("blog.title")}
              </span>
              <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-3">
                {t("blog.title")}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] max-w-lg">
                {t("blog.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all",
                  cat === t("blog.cat_all")
                    ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                    : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Articles grid */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTICLES.map((article, i) => (
              <div
                key={article.slug}
              >
                <Link
                  href={`/blog/${article.slug}`}
                  className="group block rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden card-hover"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="soft" className="bg-white/90 dark:bg-black/60 backdrop-blur-sm text-xs">{CATEGORY_MAP[article.category] || article.category}</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-2">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h2 className="font-semibold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors leading-snug mb-2">{article.title}</h2>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-[var(--text-tertiary)]">
                      <span>{t("blog.by") + " " + article.author}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
