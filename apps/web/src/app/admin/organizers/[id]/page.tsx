"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminOrganizerDetailPage() {
  const [suspended, setSuspended] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/organizers" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
          </Link>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent)]/20 flex items-center justify-center">
                <span className="font-bold text-xl">CC</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)]">Club Culturel UAC</h1>
                  <Check className="w-4 h-4 text-[var(--brand)]" />
                </div>
                <p className="text-sm text-[var(--text-secondary)]">contact@clubculturel.com · Vérifié</p>
              </div>
            </div>
            <Badge variant={suspended ? "error" : "success"}>{suspended ? "Suspendu" : "Actif"}</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center"><p className="text-xl font-bold text-[var(--text)]">24</p><p className="text-xs text-[var(--text-secondary)]">Événements</p></div>
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center"><p className="text-xl font-bold text-[var(--text)]">450k</p><p className="text-xs text-[var(--text-secondary)]">Revenus</p></div>
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center"><p className="text-xl font-bold text-[var(--text)]">1.2k</p><p className="text-xs text-[var(--text-secondary)]">Abonnés</p></div>
          </div>
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-3">
            <h3 className="font-semibold text-sm text-[var(--text)]">Actions</h3>
            <Button variant={suspended ? "outline" : "danger"} size="sm" className="w-full" onClick={() => setSuspended(!suspended)}>
              {suspended ? <><Check className="w-4 h-4" /> Réactiver</> : <><Ban className="w-4 h-4" /> Suspendre</>}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
