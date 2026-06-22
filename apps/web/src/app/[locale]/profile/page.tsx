"use client";
import { useTranslations } from "next-intl";

import { useState } from "react";
import { Link } from "@/i18n/routing";
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
  const t = useTranslations();

  const menuItems = [
    { icon: User, label: t("profile.personalInfo"), href: "#" },
    { icon: Mail, label: t("profile.notifications"), href: "#", badge: "3" },
    { icon: Settings, label: t("nav.settings"), href: "#" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Profile header */}
        <section className="relative pt-8 pb-20 overflow-hidden reveal">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none reveal" />
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--brand)]/4 blur-[100px] pointer-events-none reveal" />

          <div
           
           
           
            className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center reveal"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-6 reveal">
              <Sparkles className="w-3 h-3 reveal" />
              {t("profile.title")}
            </span>

            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-brand)] overflow-hidden reveal">
              <span className="text-white font-bold text-3xl font-[family-name:var(--font-display)] reveal">{getInitials(profile.fullname)}</span>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--surface)] flex items-center justify-center shadow-[var(--shadow-sm)] hover:bg-[var(--border-subtle)] transition-colors reveal">
                <Camera className="w-3.5 h-3.5 text-[var(--text-secondary)] reveal" />
              </button>
            </div>
            <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight reveal">{profile.fullname}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5 reveal">{profile.university}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5 reveal">{profile.city} · {profile.faculty}</p>
          </div>
        </section>

        <div
         
         
         
          className="max-w-2xl mx-auto px-4 sm:px-6 -mt-12 space-y-5 reveal"
        >
          {/* Profile info card */}
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] reveal">
            <div className="flex items-center justify-between mb-4 reveal">
              <h2 className="font-semibold text-[var(--text)] reveal">{t("nav.profile")}</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
                {editing ? t("common.save") : t("profile.edit")}
              </Button>
            </div>
            <div className={`space-y-4 transition-opacity duration-300 ${editing ? "" : "opacity-70 pointer-events-none"}`}>
              <Input label={t("profile.fullName")} value={profile.fullname} onChange={(e) => setProfile({ ...profile, fullname: e.target.value })} />
              <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <Input label={t("profile.phone")} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              <Input label={t("profile.university")} value={profile.university} onChange={(e) => setProfile({ ...profile, university: e.target.value })} />
              <Input label={t("profile.city")} value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] divide-y divide-[var(--border-subtle)] overflow-hidden shadow-[var(--shadow-sm)] reveal pressable">
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 p-4 hover:bg-[var(--border-subtle)] transition-colors reveal pressable">
                <div className="w-9 h-9 rounded-xl bg-[var(--border-subtle)] flex items-center justify-center reveal pressable">
                  <item.icon className="w-4 h-4 text-[var(--text-secondary)] reveal pressable" />
                </div>
                <span className="flex-1 text-sm font-medium text-[var(--text)] reveal pressable">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-[var(--brand)] text-white text-[10px] font-bold flex items-center justify-center reveal pressable">{item.badge}</span>
                )}
                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] reveal pressable" />
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 reveal pressable">
            {[
              { label: t("profile.events"), value: "12" },
              { label: t("nav.favorites"), value: "8" },
              { label: t("nav.tickets"), value: "4" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center shadow-[var(--shadow-sm)] reveal pressable">
                <p className="text-2xl font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)] reveal pressable">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 reveal pressable">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Logout */}
          <div>
            <button className="w-full flex items-center justify-center gap-2 p-4 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-2xl transition-colors border border-rose-200/50 dark:border-rose-900/30 reveal pressable">
              <LogOut className="w-4 h-4 reveal pressable" />
              {t("nav.logout")}
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
