"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReviewEventPage() {
  const t = useTranslations();
  const params = useParams();
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="flex items-center h-14 px-4 max-w-4xl mx-auto">
          <Link href="/moderator" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            {t("common.back")}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div  >
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="warning">{t("admin.pendingApproval")}</Badge>
            <span className="text-xs text-[var(--text-secondary)]">Soumis le 12 juil. 2025</span>
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">{t("moderator.review")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-8">Vérifie les informations et approuve ou rejette l&apos;événement.</p>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-4 mb-6">
            <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--accent)]/10 flex items-center justify-center border border-[var(--border)] text-sm text-[var(--text-tertiary)]">Affiche de l&apos;événement</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-[var(--text-tertiary)]">Titre</span><p className="text-[var(--text)] font-medium">Hackathon IA & Data</p></div>
              <div><span className="text-[var(--text-tertiary)]">Catégorie</span><p className="text-[var(--text)] font-medium">Hackathon</p></div>
              <div><span className="text-[var(--text-tertiary)]">Organisateur</span><p className="text-[var(--text)] font-medium">Club IA UAC</p></div>
              <div><span className="text-[var(--text-tertiary)]">Date</span><p className="text-[var(--text)] font-medium">15 juil. 2025</p></div>
              <div><span className="text-[var(--text-tertiary)]">Ville</span><p className="text-[var(--text)] font-medium">Abomey-Calavi</p></div>
              <div><span className="text-[var(--text-tertiary)]">Prix</span><p className="text-[var(--text)] font-medium">Gratuit</p></div>
            </div>
          </div>

          {action === "approve" && (
            <div  className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 p-6 text-center">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-emerald-700 dark:text-emerald-300">{t("moderator.approved")}</p>
              <p className="text-xs text-emerald-600/70 mt-1">{t("moderator.approvedDesc")}</p>
              <Button variant="outline" size="sm" className="mt-4 pressable" asChild><Link href="/moderator">{t("common.back")}</Link></Button>
            </div>
          )}

          {action === "reject" && (
            <div  className="space-y-4 pressable">
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] pressable">
                <label className="block text-sm font-medium text-[var(--text)] mb-2 pressable">{t("moderator.rejectReason")}</label>
                <textarea
                  className="w-full h-28 rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none pressable"
                  placeholder={t("moderator.rejectPlaceholder")}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex gap-3 mt-4 pressable">
                  <Button variant="outline" size="sm" onClick={() => setAction(null)}>{t("common.cancel")}</Button>
                  <Button variant="danger" size="sm" onClick={() => setReason("")}><X className="w-3 h-3 pressable" /> {t("moderator.rejectEvent")}</Button>
                </div>
              </div>
            </div>
          )}

          {!action && (
            <div className="flex gap-3 pressable">
              <Button variant="primary" size="lg" className="flex-1 pressable" onClick={() => setAction("approve")}>
                <Check className="w-4 h-4 pressable" /> {t("moderator.approveEvent")}
              </Button>
              <Button variant="outline" size="lg" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 pressable" onClick={() => setAction("reject")}>
                <X className="w-4 h-4 pressable" /> {t("moderator.rejectEvent")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
