"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const INITIAL = [
  { id: "1", name: "Cotonou" },
  { id: "2", name: "Abomey-Calavi" },
  { id: "3", name: "Porto-Novo" },
  { id: "4", name: "Parakou" },
  { id: "5", name: "Lokossa" },
];

export default function AdminCitiesPage() {
  const t = useTranslations();
  const [cities, setCities] = useState(INITIAL);
  const [newName, setNewName] = useState("");

  const add = () => {
    if (!newName.trim()) return;
    setCities([...cities, { id: String(Date.now()), name: newName }]);
    setNewName("");
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">{t("admin.cities")}</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{t("admin.citiesDesc")}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
            <Input placeholder={t("admin.newCity")} value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
            <Button variant="primary" size="md" onClick={add}><Plus className="w-4 h-4" /> {t("admin.add")}</Button>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {cities.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                <span className="font-medium text-sm text-[var(--text)]">{c.name}</span>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-[var(--border-subtle)] text-[var(--text-tertiary)]"><Pencil className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
