"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search, ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { adminService } from "@/lib/services/organizer-service";
import { getApiErrorMessage } from "@/lib/api-client";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function AdminOrganizersPage() {
  const t = useTranslations();
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useScrollReveal();

  useEffect(() => {
    adminService
      .getOrganizers()
      .then((data: any) => setOrganizers(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = organizers.filter(
    (o: any) =>
      (o.organizationName ?? o.name ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
              {t("admin.organizers")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {t("admin.organizersDesc")}
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder={t("admin.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
            />
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden card-hover">
            {loading ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                Chargement...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                {t("admin.noResults")}
              </div>
            ) : (
              filtered.map((org: any) => (
                <div key={org.id ?? org.organizationName}>
                  <Link
                    href={`/admin/organizers/${org.id}`}
                    className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent)]/20 flex items-center justify-center font-bold text-sm card-hover">
                        {(org.organizationName ?? org.name ?? "O").charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm text-[var(--text)]">
                            {org.organizationName ?? org.name}
                          </span>
                          {org.verified && (
                            <Check className="w-3.5 h-3.5 text-[var(--brand)]" />
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {org._count?.events ?? org.eventsCount ?? 0}{" "}
                          {t("admin.events")} ·{" "}
                          {org.revenue
                            ? `${Number(org.revenue).toLocaleString()} FCFA`
                            : "0 FCFA"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
