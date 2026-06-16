"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Ban, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeUp, containerStagger } from "@/lib/motion";

export default function AdminUserDetailPage() {
  const params = useParams();
  const [banned, setBanned] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div variants={containerStagger(0.07)} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">AK</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)]">Alex Koffi</h1>
                <p className="text-sm text-[var(--text-secondary)]">alex@univibes.com · Étudiant</p>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.3, ease: [0.25, 0.1, 0, 1] }}>
              <Badge variant={banned ? "error" : "success"}>{banned ? "Suspendu" : "Actif"}</Badge>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { label: "Université", value: "UAC - Abomey-Calavi" },
              { label: "Inscrit depuis", value: "12 mars 2025" },
            ].map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
                className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5"
              >
                <p className="text-xs text-[var(--text-tertiary)] mb-2">{info.label}</p>
                <p className="font-medium text-sm text-[var(--text)]">{info.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] space-y-3"
          >
            <h3 className="font-semibold text-sm text-[var(--text)]">Actions</h3>
            <Button variant={banned ? "outline" : "danger"} size="sm" className="w-full" onClick={() => setBanned(!banned)}>
              {banned ? <><Check className="w-4 h-4" /> Réactiver</> : <><Ban className="w-4 h-4" /> Suspendre</>}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
