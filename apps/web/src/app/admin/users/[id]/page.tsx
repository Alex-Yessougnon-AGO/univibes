"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Ban, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminUserDetailPage() {
  const params = useParams();
  const [banned, setBanned] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Retour
          </Link>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center">
                <span className="text-white font-bold text-xl">AK</span>
              </div>
              <div>
                <h1 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)]">Alex Koffi</h1>
                <p className="text-sm text-[var(--text-secondary)]">alex@univibes.com · Étudiant</p>
              </div>
            </div>
            <Badge variant={banned ? "error" : "success"}>{banned ? "Suspendu" : "Actif"}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <p className="text-xs text-[var(--text-tertiary)] mb-2">Université</p>
              <p className="font-medium text-sm text-[var(--text)]">UAC - Abomey-Calavi</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
              <p className="text-xs text-[var(--text-tertiary)] mb-2">Inscrit depuis</p>
              <p className="font-medium text-sm text-[var(--text)]">12 mars 2025</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] space-y-3">
            <h3 className="font-semibold text-sm text-[var(--text)]">Actions</h3>
            <Button variant={banned ? "outline" : "danger"} size="sm" className="w-full" onClick={() => setBanned(!banned)}>
              {banned ? <><Check className="w-4 h-4" /> Réactiver</> : <><Ban className="w-4 h-4" /> Suspendre</>}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
