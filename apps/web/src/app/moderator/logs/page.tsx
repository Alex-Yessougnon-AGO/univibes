"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LOGS = [
  { action: "Approbation événement", target: "Hackathon IA & Data", moderator: "Modérateur #1", date: "12 juil. 2025 14:32", type: "approve" as const },
  { action: "Rejet événement", target: "Soirée Electro", moderator: "Modérateur #2", date: "11 juil. 2025 09:15", type: "reject" as const },
  { action: "Signalement ignoré", target: "Événement #452", moderator: "Modérateur #1", date: "10 juil. 2025 16:48", type: "ignore" as const },
  { action: "Avertissement envoyé", target: "Organisateur #89", moderator: "Modérateur #3", date: "09 juil. 2025 11:02", type: "warn" as const },
  { action: "Approbation événement", target: "Tournoi FIFA 2025", moderator: "Modérateur #1", date: "08 juil. 2025 10:30", type: "approve" as const },
  { action: "Suppression commentaire", target: "Événement #328", moderator: "Modérateur #2", date: "07 juil. 2025 15:20", type: "delete" as const },
];

export default function ModeratorLogsPage() {
  const [search, setSearch] = useState("");

  const filtered = LOGS.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.target.toLowerCase().includes(search.toLowerCase()) ||
    l.moderator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="flex items-center justify-between h-14 px-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center"><Clock className="w-4 h-4 text-white" /></div>
            <span className="font-extrabold text-sm text-[var(--text)]">Journal d'actions</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Journal des actions</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Historique de toutes les décisions de modération.</p>

          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input type="text" placeholder="Rechercher dans le journal..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30" />
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            <div className="hidden md:grid grid-cols-4 gap-4 p-4 border-b border-[var(--border)] text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              <span>Action</span><span>Cible</span><span>Modérateur</span><span>Date</span>
            </div>
            {filtered.map((log, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                <div className="flex items-center gap-2">
                  <Badge variant={log.type === "approve" ? "success" : log.type === "reject" ? "error" : log.type === "warn" ? "warning" : "soft"} className="text-[10px] shrink-0">
                    {log.type === "approve" ? "Approuvé" : log.type === "reject" ? "Rejeté" : log.type === "warn" ? "Averti" : log.type === "delete" ? "Supprimé" : "Ignoré"}
                  </Badge>
                  <span className="text-sm text-[var(--text)]">{log.action}</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)] md:text-center">{log.target}</span>
                <span className="text-sm text-[var(--text-secondary)]">{log.moderator}</span>
                <span className="text-sm text-[var(--text-tertiary)] md:text-right">{log.date}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
