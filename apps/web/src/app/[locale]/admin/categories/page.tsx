"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { categoriesService } from "@/lib/services/events-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminCategoriesPage() {
  const t = useTranslations();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  useScrollReveal();

  useEffect(() => {
    categoriesService
      .findAll()
      .then((data: any) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addCategory = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, "-");
    setCategories([
      ...categories,
      { id: String(Date.now()), name: newName, slug, _count: { events: 0 } },
    ]);
    setNewName("");
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
              {t("admin.categories")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {t("admin.categoriesDesc")}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Input
              placeholder={t("admin.newCategory")}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="md"
              onClick={addCategory}
              className="pressable"
            >
              <Plus className="w-4 h-4" /> {t("admin.add")}
            </Button>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden card-hover">
            {loading ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                Chargement...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                {t("common.noResults")}
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0"
                >
                  <div>
                    <span className="font-medium text-sm text-[var(--text)]">
                      {cat.name}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] ml-2">
                      /{cat.slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {t("admin.eventsCount", {
                        count: cat._count?.events ?? 0,
                      })}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--border-subtle)] text-[var(--text-tertiary)]">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
