"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";

const ARTICLES: Record<string, { title: string; content: string; author: string; date: string; category: string; image: string; readTime: string }> = {
  "comment-creer-un-evenement-etudiant-reussi": {
    title: "Comment créer un événement étudiant réussi ?",
    content: `Organiser un événement étudiant n'est pas une mince affaire. Entre les cours, les exams et la vie associative, il faut être organisé et stratégique.

## 1. Définir son objectif

Avant toute chose, demande-toi : pourquoi cet événement ? Vendre des billets ? Faire connaître ton association ? Créer du lien entre étudiants ? Un objectif clair guidera toutes tes décisions.

## 2. Choisir la bonne date

Évite les périodes d'examens, les vacances scolaires et les jours fériés. Les jeudi et vendredi soir sont généralement les créneaux les plus prisés.

## 3. Soigner la communication

Une belle affiche, c'est bien. Une stratégie de communication sur plusieurs canaux (WhatsApp, Instagram, Univibes), c'est mieux. Poste régulièrement pour créer de l'attente.

## 4. Utiliser les bons outils

Univibes te permet de créer ton événement en quelques minutes, de gérer ta billetterie et de suivre tes statistiques en temps réel. Profites-en !

## 5. Prévoir l'après-événement

Remercie les participants, recueille leurs avis et commence déjà à préparer le prochain événement. La fidélisation est la clé du succès.`,
    author: "Alex Koffi",
    date: "12 juin 2025",
    category: "Conseils",
    image: "https://picsum.photos/seed/blog1/1200/600",
    readTime: "5 min",
  },
};

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = ARTICLES[slug];

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pb-24 md:pb-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] mb-2">Article introuvable</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Cet article n&apos;existe pas ou a été supprimé.</p>
            <Button variant="outline" asChild><Link href="/blog"><ArrowLeft className="w-4 h-4" /> Retour au blog</Link></Button>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour au blog
            </Link>

            <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-8">
              <Image src={article.image} alt={article.title} fill className="object-cover" priority />
            </div>

            <Badge variant="soft" className="mb-4">{article.category}</Badge>
            <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mb-8 pb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{article.date}</div>
              <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{article.readTime}</div>
              <span>Par {article.author}</span>
            </div>

            <div className="prose prose-sm max-w-none text-sm text-[var(--text-secondary)] leading-relaxed space-y-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--text)] [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4">
              {article.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
                if (line.trim() === '') return null;
                return <p key={i}>{line}</p>;
              })}
            </div>

            <div className="flex items-center gap-3 mt-10 pt-6 border-t border-[var(--border)]">
              <Button variant="outline" size="sm" className="gap-1.5"><Share2 className="w-3.5 h-3.5" /> Partager</Button>
              <Button variant="ghost" size="sm" className="gap-1.5"><Heart className="w-3.5 h-3.5" /> Enregistrer</Button>
              <div className="flex-1" />
              <Button variant="primary" size="sm" asChild><Link href="/blog">Article suivant <ArrowRight className="w-3.5 h-3.5" /></Link></Button>
            </div>
          </motion.div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
