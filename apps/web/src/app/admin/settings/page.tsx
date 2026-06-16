"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    commission: "5",
    maxEventsPerOrg: "50",
    requireVerification: "yes",
    maintenance: "no",
  });

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">Paramètres</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Configuration générale de la plateforme.</p>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)]">
            <Input label="Commission billetterie (%)" type="number" value={settings.commission} onChange={(e) => setSettings({ ...settings, commission: e.target.value })} />
            <Input label="Événements max par organisateur" type="number" value={settings.maxEventsPerOrg} onChange={(e) => setSettings({ ...settings, maxEventsPerOrg: e.target.value })} />
            
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Vérification organisateur obligatoire</label>
              <select className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
                value={settings.requireVerification} onChange={(e) => setSettings({ ...settings, requireVerification: e.target.value })}>
                <option value="yes">Oui</option><option value="no">Non</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Mode maintenance</label>
              <select className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
                value={settings.maintenance} onChange={(e) => setSettings({ ...settings, maintenance: e.target.value })}>
                <option value="no">Désactivé</option><option value="yes">Activé</option>
              </select>
            </div>

            <Button variant="primary" size="md"><Save className="w-4 h-4" /> Enregistrer</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
