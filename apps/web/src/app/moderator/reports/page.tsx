"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const REPORTS = [
  { id: "1", event: "Soirée Electro", reason: "Contenu inapproprié", reporter: "Anonyme", status: "pending" },
  { id: "2", event: "Tournoi FIFA", reason: "Fausse information", reporter: "Modibo D.", status: "pending" },
];

export default function ReportsPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-white" /></div>
            <span className="font-extrabold text-sm text-[var(--text)]">Signalements</span>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-6">Signalements</h1>
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {REPORTS.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-[var(--text-secondary)]">Aucun signalement en attente.</p>
              </div>
            ) : (
              REPORTS.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text)]">{r.event}</span>
                      <Badge variant="warning" className="text-[10px]">En cours</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{r.reason} · Signalé par {r.reporter}</p>
                  </div>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--border-subtle)]"><ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" /></button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
