"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { getInitials } from "@/lib/utils";

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    fullname: "Alex Koffi",
    email: "alex.koffi@univibes.com",
    phone: "+229 01 23 45 67",
    university: "UAC - Université d'Abomey-Calavi",
    city: "Cotonou",
    faculty: "FASEG",
    bio: "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative pt-8 pb-6 overflow-hidden">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors mb-6 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                Retour au profil
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
                    <Sparkles className="w-3 h-3" />
                    Modifier le profil
                  </span>
                  <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">Mon profil</h1>
                </div>
                <Button variant="primary" size="sm" onClick={handleSave} disabled={saved}>
                  {saved ? <><Check className="w-4 h-4" /> Enregistré</> : "Enregistrer"}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center shadow-[var(--shadow-brand)]">
                <span className="text-white font-bold text-2xl">{getInitials(profile.fullname)}</span>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--surface)] border-2 border-[var(--surface)] flex items-center justify-center shadow-[var(--shadow-sm)] cursor-pointer hover:bg-[var(--border-subtle)] transition-colors">
                  <Camera className="w-3 h-3 text-[var(--text-secondary)]" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--text)]">Photo de profil</p>
                <p className="text-xs text-[var(--text-secondary)]">PNG, JPG ou WEBP. Max 5 Mo.</p>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-4">
              <h2 className="font-semibold text-[var(--text)] mb-1">Informations personnelles</h2>
              <Input label="Nom complet" value={profile.fullname} onChange={(e) => setProfile({ ...profile, fullname: e.target.value })} />
              <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <Input label="Téléphone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              <Input label="Université" value={profile.university} onChange={(e) => setProfile({ ...profile, university: e.target.value })} />
              <Input label="Ville" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
              <Input label="Faculté" value={profile.faculty} onChange={(e) => setProfile({ ...profile, faculty: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Bio</label>
                <textarea
                  placeholder="Parle-nous de toi..."
                  className="w-full h-24 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] resize-none"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full" onClick={handleSave}>
              {saved ? <><Check className="w-4 h-4" /> Enregistré</> : "Enregistrer les modifications"}
            </Button>
          </motion.div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
