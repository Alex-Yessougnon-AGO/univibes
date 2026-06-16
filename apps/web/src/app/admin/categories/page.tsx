"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const INITIAL_CATS = [
  { id: "1", name: "Concerts", slug: "concert", events: 45 },
  { id: "2", name: "Conférences", slug: "conference", events: 32 },
  { id: "3", name: "Sport", slug: "sport", events: 28 },
  { id: "4", name: "Galas", slug: "gala", events: 19 },
  { id: "5", name: "Hackathons", slug: "hackathon", events: 15 },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATS);
  const [newName, setNewName] = useState("");

  const addCategory = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, "-");
    setCategories([...categories, { id: String(Date.now()), name: newName, slug, events: 0 }]);
    setNewName("");
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Catégories</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Gère les catégories d&apos;événements.</p>

          <div className="flex items-center gap-2 mb-6">
            <Input placeholder="Nouvelle catégorie" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
            <Button variant="primary" size="md" onClick={addCategory}><Plus className="w-4 h-4" /> Ajouter</Button>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0">
                <div>
                  <span className="font-medium text-sm text-[var(--text)]">{cat.name}</span>
                  <span className="text-xs text-[var(--text-tertiary)] ml-2">/{cat.slug}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-secondary)]">{cat.events} événements</span>
                  <button className="p-1.5 rounded-lg hover:bg-[var(--border-subtle)] text-[var(--text-tertiary)]"><Pencil className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
