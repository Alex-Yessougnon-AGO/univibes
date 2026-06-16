"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeUp, containerStagger } from "@/lib/motion";

export default function AdminOrganizerDetailPage() {
  const [suspended, setSuspended] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div variants={containerStagger(0.07)} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <Link href="/admin/organizers" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent)]/20 flex items-center justify-center"
              >
                <span className="font-bold text-xl">CC</span>
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)]">Club Culturel UAC</h1>
                  <motion.div initial={{ opacity: 0, rotate: -20 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
                    <Check className="w-4 h-4 text-[var(--brand)]" />
                  </motion.div>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">contact@clubculturel.com · Vérifié</p>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.3, ease: [0.25, 0.1, 0, 1] }}>
              <Badge variant={suspended ? "error" : "success"}>{suspended ? "Suspendu" : "Actif"}</Badge>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Événements", value: "24" },
              { label: "Revenus", value: "450k" },
              { label: "Abonnés", value: "1.2k" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
                className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center"
              >
                <p className="text-xl font-bold text-[var(--text)]">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-3"
          >
            <h3 className="font-semibold text-sm text-[var(--text)]">Actions</h3>
            <Button variant={suspended ? "outline" : "danger"} size="sm" className="w-full" onClick={() => setSuspended(!suspended)}>
              {suspended ? <><Check className="w-4 h-4" /> Réactiver</> : <><Ban className="w-4 h-4" /> Suspendre</>}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
