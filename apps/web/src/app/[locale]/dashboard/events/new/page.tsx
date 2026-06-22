"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Check, Upload, Plus, X, Sparkles } from "lucide-react";
import { CategoryIcon } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function NewEventPage() {
  const t = useTranslations();
  const STEPS = [t("dashboard.event.stepInfo"), t("dashboard.event.stepTicketing"), t("dashboard.event.stepPublish")];
  const [step, setStep] = useState(0);
  useScrollReveal();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    city: "",
    startDate: "",
    endDate: "",
    coverImage: null as File | null,
    tickets: [{ name: "", price: "", quantity: "" }],
  });

  const handleSubmit = () => {
    alert(t("auth.simulationAlert"));
  };

  return (
    <div
      >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : null}
          className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
        <div>
          <h1 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("hero.createEvent")}</h1>
          <p className="text-xs text-[var(--text-secondary)]">{t("dashboard.event.step")} {step + 1} {t("dashboard.event.of3")}</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              i <= step ? "bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] text-white shadow-[var(--shadow-brand)]" : "bg-[var(--border-subtle)] text-[var(--text-tertiary)]"
            )}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn("text-xs font-medium hidden sm:inline", i <= step ? "text-[var(--text)]" : "text-[var(--text-tertiary)]")}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-12 h-px bg-[var(--border)]" />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Step 1: Informations */}
        {step === 0 && (
          <div
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)] card-hover"
          >
            <h2 className="font-semibold text-[var(--text)]">{t("dashboard.event.generalInfo")}</h2>

            <div className="relative aspect-[2/1] rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--brand)]/30 transition-colors flex flex-col items-center justify-center cursor-pointer bg-[var(--border-subtle)]/50">
              <Upload className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">{t("dashboard.event.coverImage")}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{t("dashboard.event.ratioHint")}</p>
            </div>

            <Input label={t("dashboard.event.eventTitle")} placeholder="Ex: Gala de Fin d'Année" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">{t("event.description")}</label>
              <textarea
                placeholder="Décris ton événement en quelques lignes..."
                className="w-full h-32 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] resize-none"
              />
            </div>

            <Input label={t("event.location")} placeholder="Ex: Palais des Congrès" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input label={t("profile.city")} placeholder="Ex: Cotonou" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t("dashboard.event.startDate")} type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              <Input label={t("dashboard.event.endDate")} type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">{t("event.category")}</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setForm({ ...form, category: cat.slug })}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      form.category === cat.slug
                        ? "text-white shadow-sm"
                        : "bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                    )}
                    style={form.category === cat.slug ? { backgroundColor: cat.color } : undefined}
                  >
                    <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" /> {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" size="md" className="w-full pressable" onClick={() => setStep(1)}>
              Continuer vers la billetterie
            </Button>
          </div>
        )}

        {/* Step 2: Billetterie */}
        {step === 1 && (
          <div
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)] card-hover"
          >
            <h2 className="font-semibold text-[var(--text)]">{t("event.tickets")}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{t("dashboard.event.ticketTypesHint")}</p>

            {form.tickets.map((ticket, i) => (
              <div key={i} className="p-4 rounded-xl border border-[var(--border)] space-y-3 relative card-hover">
                {form.tickets.length > 1 && (
                  <button
                    onClick={() => setForm({ ...form, tickets: form.tickets.filter((_, j) => j !== i) })}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Input label={t("event.ticketName")} placeholder="Standard VIP" value={ticket.name} onChange={(e) => {
                    const tickets = [...form.tickets];
                    tickets[i].name = e.target.value;
                    setForm({ ...form, tickets });
                  }} />
                  <Input label={t("event.ticketPrice")} type="number" placeholder="5000" value={ticket.price} onChange={(e) => {
                    const tickets = [...form.tickets];
                    tickets[i].price = e.target.value;
                    setForm({ ...form, tickets });
                  }} />
                </div>
                <Input label={t("event.ticketQuantity")} type="number" placeholder="200" value={ticket.quantity} onChange={(e) => {
                  const tickets = [...form.tickets];
                  tickets[i].quantity = e.target.value;
                  setForm({ ...form, tickets });
                }} />
              </div>
            ))}

            <button
              onClick={() => setForm({ ...form, tickets: [...form.tickets, { name: "", price: "", quantity: "" }] })}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--brand)]/30 hover:text-[var(--brand)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un type de billet
            </button>

            <div className="flex gap-3">
              <Button variant="outline" size="md" className="flex-1 pressable" onClick={() => setStep(0)}>
                {t("common.back")}
              </Button>
              <Button variant="primary" size="md" className="flex-1 pressable" onClick={() => setStep(2)}>
                Continuer
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Publication */}
        {step === 2 && (
          <div
            className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)] card-hover"
          >
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-brand)] card-hover">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">{t("common.almostDone")}</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-sm mx-auto">
                Vérifie une dernière fois les informations avant de publier ton événement.
              </p>
            </div>

            <div className="rounded-xl bg-[var(--border-subtle)] p-4 space-y-2 text-sm card-hover">
              <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">{t("dashboard.event.eventTitle")}</span><span className="text-[var(--text)] font-medium">{form.title || "—"}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">{t("event.location")}</span><span className="text-[var(--text)] font-medium">{form.location || "—"}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Ville</span><span className="text-[var(--text)] font-medium">{form.city || "—"}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">{t("event.tickets")}</span><span className="text-[var(--text)] font-medium">{form.tickets.filter(t => t.name).length}</span></div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="md" className="flex-1 pressable" onClick={() => setStep(1)}>
                {t("common.back")}
              </Button>
              <Button variant="primary" size="md" className="flex-1 pressable" onClick={handleSubmit}>
                Publier l&apos;événement
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
