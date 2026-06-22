"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eventsService } from "@/lib/services/events-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminCitiesPage() {
  const t = useTranslations();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  useScrollReveal();

  useEffect(() => {
    eventsService
      .getCities()
      .then((data: any) => setCities(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const add = () => {
    if (!newName.trim()) return;
    setCities([...cities, { id: String(Date.now()), city: newName, count: 0 }]);
    setNewName("");
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
              {t("admin.cities")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {t("admin.citiesDesc")}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Input
              placeholder={t("admin.newCity")}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="md"
              onClick={add}
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
            ) : cities.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                {t("common.noResults")}
              </div>
            ) : (
              cities.map((c, i) => (
                <div
                  key={c.city ?? i}
                  className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0"
                >
                  <div>
                    <span className="font-medium text-sm text-[var(--text)]">
                      {c.city}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] ml-2">
                      {c.count ?? 0} événements
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
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
