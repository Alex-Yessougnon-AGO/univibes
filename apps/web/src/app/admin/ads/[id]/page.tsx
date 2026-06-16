"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, MousePointer, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminAdDetailPage() {
  const params = useParams();

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/ads" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge variant="success" className="mb-2">Active</Badge>
              <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">Campagne — Rentrée UAC</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Ciblage : Abomey-Calavi · 50 000 FCFA</p>
            </div>
            <Button variant="outline" size="sm">Mettre en pause</Button>
          </div>

          <div className="aspect-[3/1] rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center mb-6 text-sm text-[var(--text-tertiary)]">Aperçu de la bannière</div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center">
              <Eye className="w-5 h-5 text-[var(--brand)] mx-auto mb-1" />
              <p className="text-xl font-bold text-[var(--text)]">12.4k</p>
              <p className="text-xs text-[var(--text-secondary)]">Impressions</p>
            </div>
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center">
              <MousePointer className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-[var(--text)]">843</p>
              <p className="text-xs text-[var(--text-secondary)]">Clics</p>
            </div>
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center">
              <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-[var(--text)]">6.8%</p>
              <p className="text-xs text-[var(--text-secondary)]">CTR</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Début</span><span className="text-[var(--text)]">12 juin 2025</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Fin</span><span className="text-[var(--text)]">12 juillet 2025</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Budget</span><span className="text-[var(--text)] font-medium">50 000 FCFA</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Dépensé</span><span className="text-[var(--text)] font-medium">32 500 FCFA</span></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
