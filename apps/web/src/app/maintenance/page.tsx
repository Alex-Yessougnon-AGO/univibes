"use client";

import { motion } from "framer-motion";
import { Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] px-5">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">En maintenance</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">On apporte les dernières retouches. Reviens dans quelques minutes !</p>
        <Button variant="outline" disabled><ArrowLeft className="w-4 h-4" /> Réessayer</Button>
      </motion.div>
    </div>
  );
}
