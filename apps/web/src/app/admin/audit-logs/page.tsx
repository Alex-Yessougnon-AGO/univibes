"use client";

import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LOGS = [
  { action: "Approbation événement", actor: "Modérateur #1", target: "Hackathon IA & Data", date: "12 juil. 2025 14:32", type: "approve" },
  { action: "Rejet événement", actor: "Modérateur #2", target: "Soirée Electro", date: "11 juil. 2025 09:15", type: "reject" },
  { action: "Suspension utilisateur", actor: "Admin", target: "user_45a2", date: "10 juil. 2025 16:48", type: "suspend" },
  { action: "Modification catégorie", actor: "Admin", target: "Sport → E-sport", date: "09 juil. 2025 11:02", type: "edit" },
];

export default function AuditLogsPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Journal d'audit</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Toutes les actions admin et modérateur.</p>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {LOGS.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--border-subtle)] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text)]">{log.action}</span>
                      <Badge variant={log.type === "approve" ? "success" : log.type === "reject" ? "error" : "soft"} className="text-[10px]">{log.type}</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{log.actor} · {log.target}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-tertiary)]">{log.date}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
