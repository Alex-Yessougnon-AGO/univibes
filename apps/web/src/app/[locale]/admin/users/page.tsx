"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const USERS = [
  { name: "Koffi Amoussou", email: "koffi.a@email.com", role: "Organisateur", status: "Actif", events: 12, verified: true },
  { name: "Sarah Béké", email: "sarah.b@email.com", role: "Étudiant", status: "Actif", events: 0, verified: false },
  { name: "Jean-Pierre Adé", email: "jp.ade@email.com", role: "Admin", status: "Actif", events: 0, verified: true },
  { name: "Mariam Diallo", email: "mariam.d@email.com", role: "Organisateur", status: "Suspendu", events: 5, verified: false },
  { name: "Paul Hounkpe", email: "paul.h@email.com", role: "Modérateur", status: "Actif", events: 0, verified: true },
];

export default function AdminUsersPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">{t("admin.users")}</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{USERS.length} {t("admin.users")}</p>
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)]">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder={t("admin.searchUsers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/50">
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t("admin.users")}</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Rôle</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">Statut</th>
                <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">{t("admin.events")}</th>
                <th className="w-10 px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
                <tr key={user.email} className="hover:bg-[var(--border-subtle)]/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text)] flex items-center gap-1.5">
                          {user.name}
                          {user.verified && (
                            <span className="w-3.5 h-3.5 rounded-full bg-[var(--brand)] flex items-center justify-center">
                              <svg viewBox="0 0 16 16" fill="white" className="w-2 h-2"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <Badge variant={user.role === "Admin" ? "gold" : user.role === "Modérateur" ? "warning" : user.role === "Organisateur" ? "default" : "soft"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <Badge variant={user.status === "Actif" ? "success" : "error"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-[var(--text-secondary)]">{user.events}</td>
                  <td className="px-4 py-3.5">
                    <button className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
