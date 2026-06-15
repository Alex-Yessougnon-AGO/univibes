"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Plus, Sparkles, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ADS = [
  { id: "AD-001", name: "Campus Market", image: "https://picsum.photos/seed/ad1/400/200", city: "Cotonou", start: "01 Juil 2025", end: "31 Juil 2025", impressions: "12 400", clicks: "890", active: true },
  { id: "AD-002", name: "Tech Store BJ", image: "https://picsum.photos/seed/ad2/400/200", city: "Abomey-Calavi", start: "15 Juin 2025", end: "15 Juil 2025", impressions: "8 200", clicks: "520", active: true },
  { id: "AD-003", name: "Food Express", image: "https://picsum.photos/seed/ad3/400/200", city: "Toutes", start: "01 Mai 2025", end: "30 Mai 2025", impressions: "18 900", clicks: "1 340", active: false },
];

export default function AdminAdsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
            <Megaphone className="w-3 h-3" />
            Publicité
          </span>
          <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Publicités</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gestion des campagnes publicitaires</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4" />
          Nouvelle pub
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADS.map((ad) => (
          <div key={ad.id} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
            <div className="relative aspect-[2/1]">
              <Image src={ad.image} alt={ad.name} fill className="object-cover" />
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[var(--text)]">{ad.name}</h3>
                <Badge variant={ad.active ? "success" : "soft"}>{ad.active ? "Actif" : "Terminé"}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-[var(--text-tertiary)]">Ville :</span><span className="text-[var(--text-secondary)] ml-1">{ad.city}</span></div>
                <div><span className="text-[var(--text-tertiary)]">Impressions :</span><span className="text-[var(--text-secondary)] ml-1">{ad.impressions}</span></div>
                <div><span className="text-[var(--text-tertiary)]">Début :</span><span className="text-[var(--text-secondary)] ml-1">{ad.start}</span></div>
                <div><span className="text-[var(--text-tertiary)]">Clics :</span><span className="text-[var(--text-secondary)] ml-1">{ad.clicks}</span></div>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">CTR</span>
                  <span className="font-semibold text-[var(--text)]">{((parseInt(ad.clicks.replace(/\s/g, "")) / parseInt(ad.impressions.replace(/\s/g, ""))) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
