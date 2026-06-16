"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const INITIAL = [
  { id: "1", name: "Université d'Abomey-Calavi (UAC)", city: "Abomey-Calavi", students: 45000 },
  { id: "2", name: "Université de Parakou (UP)", city: "Parakou", students: 12000 },
  { id: "3", name: "Université Nationale du Bénin (UNB)", city: "Cotonou", students: 8000 },
  { id: "4", name: "EPAC", city: "Cotonou", students: 5000 },
  { id: "5", name: "ENEAM", city: "Cotonou", students: 4000 },
];

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState(INITIAL);
  const [newName, setNewName] = useState("");

  const add = () => {
    if (!newName.trim()) return;
    setUniversities([...universities, { id: String(Date.now()), name: newName, city: "—", students: 0 }]);
    setNewName("");
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Universités</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Gère la liste des universités référencées.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
            <Input placeholder="Nouvelle université" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
            <Button variant="primary" size="md" onClick={add}><Plus className="w-4 h-4" /> Ajouter</Button>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {universities.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                <div>
                  <span className="font-medium text-sm text-[var(--text)]">{u.name}</span>
                  <p className="text-xs text-[var(--text-secondary)]">{u.city} · {u.students.toLocaleString()} étudiants</p>
                </div>
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
