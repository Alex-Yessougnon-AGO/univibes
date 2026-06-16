"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateAdPage() {
  const [form, setForm] = useState({
    name: "",
    targetCity: "",
    budget: "",
    startDate: "",
    endDate: "",
  });

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/ads" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
          </Link>

          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Créer une publicité</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Configure une campagne publicitaire.</p>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)]">
            <div className="aspect-[2/1] rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--brand)]/30 transition-colors flex flex-col items-center justify-center cursor-pointer bg-[var(--border-subtle)]/50">
              <Upload className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">Bannière publicitaire</p>
              <p className="text-xs text-[var(--text-tertiary)]">1200×400 px recommandé</p>
            </div>

            <Input label="Nom de la campagne" placeholder="Ex: Campagne rentrée UAC" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Ville cible" placeholder="Toutes les villes" value={form.targetCity} onChange={(e) => setForm({ ...form, targetCity: e.target.value })} />              <Input label="Budget (FCFA)" type="number" placeholder="50 000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date de début" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              <Input label="Date de fin" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>

            <Button variant="primary" size="lg" className="w-full">Créer la campagne</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
