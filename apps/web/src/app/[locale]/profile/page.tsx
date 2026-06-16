"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { User, Mail, Settings, ChevronRight, LogOut, Camera, Sparkles, Heart, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullname: "Alex Koffi",
    email: "alex.koffi@univibes.com",
    phone: "+229 01 23 45 67",
    university: "UAC - Université d'Abomey-Calavi",
    city: "Cotonou",
    faculty: "FASEG",
  });

  const menuItems = [
    { icon: User, label: "Mes informations", href: "#" },
    { icon: Mail, label: "Notifications", href: "#", badge: "3" },
    { icon: Settings, label: "Paramètres", href: "#" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Profile header */}
        <section className="relative pt-8 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--brand)]/4 blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-6">
              <Sparkles className="w-3 h-3" />
              Mon profil
            </span>

            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-brand)] overflow-hidden">
              <span className="text-white font-bold text-3xl font-[family-name:var(--font-display)]">{getInitials(profile.fullname)}</span>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--surface)] flex items-center justify-center shadow-[var(--shadow-sm)] hover:bg-[var(--border-subtle)] transition-colors">
                <Camera className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              </button>
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{profile.fullname}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{profile.university}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{profile.city} · {profile.faculty}</p>
          </motion.div>
        </section>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="max-w-2xl mx-auto px-4 sm:px-6 -mt-12 space-y-5"
        >
          {/* Profile info card */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text)]">Profil</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
                {editing ? "Enregistrer" : "Modifier"}
              </Button>
            </div>
            <div className={`space-y-4 transition-opacity duration-300 ${editing ? "" : "opacity-70 pointer-events-none"}`}>
              <Input label="Nom complet" value={profile.fullname} onChange={(e) => setProfile({ ...profile, fullname: e.target.value })} />
              <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <Input label="Téléphone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              <Input label="Université" value={profile.university} onChange={(e) => setProfile({ ...profile, university: e.target.value })} />
              <Input label="Ville" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] divide-y divide-[var(--border-subtle)] overflow-hidden shadow-[var(--shadow-sm)]">
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 p-4 hover:bg-[var(--border-subtle)] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[var(--border-subtle)] flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
                <span className="flex-1 text-sm font-medium text-[var(--text)]">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-[var(--brand)] text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span>
                )}
                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />
              </Link>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            {[
              { label: "Événements", value: "12" },
              { label: "Favoris", value: "8" },
              { label: "Billets", value: "4" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center shadow-[var(--shadow-sm)]">
                <p className="text-2xl font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.div variants={fadeUp}>
            <button className="w-full flex items-center justify-center gap-2 p-4 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-2xl transition-colors border border-rose-200/50 dark:border-rose-900/30">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </motion.div>
        </motion.div>
      </main>
      <BottomNav />
    </>
  );
}
