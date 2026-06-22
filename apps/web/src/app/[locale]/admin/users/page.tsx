"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { adminService } from "@/lib/services/organizer-service";

export default function AdminUsersPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal();
  
  useEffect(() => {
    adminService.getUsers()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setUsers(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const USERS = users.length > 0 ? users : [
    { fullname: "Koffi Amoussou", email: "koffi.a@email.com", role: "organizer", status: "active", events: 12, profile: {} },
    { fullname: "Sarah Béké", email: "sarah.b@email.com", role: "student", status: "active", events: 0, profile: {} },
  ] as any[];

  const displayUsers = USERS.filter((u: any) =>
    (u.fullname || u.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const roleLabel = (role: string) => role === "admin" ? "Admin" : role === "moderator" ? "Modérateur" : role === "organizer" ? "Organisateur" : "Étudiant";
  const roleVariant = (role: string) => role === "admin" ? "gold" as const : role === "moderator" ? "warning" as const : role === "organizer" ? "default" as const : "soft" as const;
  const statusVariant = (status: string) => status === "active" || status === "Actif" ? "success" as const : "error" as const;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">{t("admin.users")}</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{USERS.length} {t("admin.users")}</p>
      </div>

      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow)] card-hover">
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
              {displayUsers.map((user: any) => {
                const name = user.fullname || user.name || "Utilisateur";
                const email = user.email || "";
                const initials = name.split(" ").filter(Boolean).map((n: string) => n[0]).join("").slice(0,2).toUpperCase();
                return (
                  <tr key={user.id || email} className="hover:bg-[var(--border-subtle)]/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center text-white font-bold text-xs shrink-0 card-hover">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text)] flex items-center gap-1.5">
                            {name}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">{email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <Badge variant={roleVariant(user.role)}>{roleLabel(user.role)}</Badge>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <Badge variant={statusVariant(user.status)}>{user.status === "active" || user.status === "Actif" ? "Actif" : "Suspendu"}</Badge>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-[var(--text-secondary)]">{user.events || user._count?.events || 0}</td>
                    <td className="px-4 py-3.5">
                      <button className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
