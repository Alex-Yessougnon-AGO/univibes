"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/lib/services/organizer-service";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const typeVariant = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("approv")) return "success" as const;
  if (a.includes("rejec")) return "error" as const;
  if (a.includes("suspen") || a.includes("delet")) return "error" as const;
  return "soft" as const;
};

export default function AuditLogsPage() {
  const t = useTranslations();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    adminService
      .getAuditLogs()
      .then((data: any) => setLogs(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div>
            <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-1">
              {t("admin.auditLogs")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {t("admin.auditLogsDesc")}
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden card-hover">
            {loading ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                Chargement...
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-tertiary)]">
                {t("common.noResults")}
              </div>
            ) : (
              logs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--border-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--border-subtle)] flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text)]">
                          {log.action}
                        </span>
                        <Badge
                          variant={typeVariant(log.action)}
                          className="text-[10px]"
                        >
                          {log.action?.slice(0, 10)}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {log.actor?.profile?.fullname ??
                          log.actor?.email ??
                          "—"}{" "}
                        · {log.entityType ?? log.entityId ?? "—"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
