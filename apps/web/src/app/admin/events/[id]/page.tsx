"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminEventDetailPage() {
  const params = useParams();

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/events" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
          </Link>

          <div className="aspect-[21/9] rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center mb-6 text-sm text-[var(--text-tertiary)]">Affiche</div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">Publié</Badge>
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">Gala de Fin d&apos;Année FASEG</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Club Culturel UAC · 15 juil. 2025 · Abomey-Calavi</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center">
              <Eye className="w-5 h-5 text-[var(--brand)] mx-auto mb-1" />
              <p className="text-xl font-bold text-[var(--text)]">12.4k</p>
              <p className="text-xs text-[var(--text-secondary)]">Vues</p>
            </div>
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center">
              <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-[var(--text)]">843</p>
              <p className="text-xs text-[var(--text-secondary)]">Favoris</p>
            </div>
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center">
              <Users className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-[var(--text)]">156</p>
              <p className="text-xs text-[var(--text-secondary)]">Participants</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] space-y-3">
            <h3 className="font-semibold text-sm text-[var(--text)]">Actions admin</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Mettre en avant</Button>
              <Button variant="danger" size="sm" className="flex-1">Archiver</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
