"use client";

import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeUp, containerStagger } from "@/lib/motion";

export default function AdminEventDetailPage() {
  const params = useParams();

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div variants={containerStagger(0.07)} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <Link href="/admin/events" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="aspect-[21/9] rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center mb-6 text-sm text-[var(--text-tertiary)]"
          >
            Affiche
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.3, ease: [0.25, 0.1, 0, 1] }}>
                  <Badge variant="success">Publié</Badge>
                </motion.div>
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">Gala de Fin d&apos;Année FASEG</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Club Culturel UAC · 15 juil. 2025 · Abomey-Calavi</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Eye, color: "text-[var(--brand)]", label: "Vues", value: "12.4k" },
              { icon: Heart, color: "text-rose-500", label: "Favoris", value: "843" },
              { icon: Users, color: "text-emerald-500", label: "Participants", value: "156" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
                className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                <p className="text-xl font-bold text-[var(--text)]">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] space-y-3"
          >
            <h3 className="font-semibold text-sm text-[var(--text)]">Actions admin</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Mettre en avant</Button>
              <Button variant="danger" size="sm" className="flex-1">Archiver</Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
