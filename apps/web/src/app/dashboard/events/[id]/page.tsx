"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EVENTS } from "@/lib/mock-data";
import { formatShortDate, formatCurrency } from "@/lib/utils";

export default function EditEventPage() {
  const params = useParams();
  const event = EVENTS.find((e) => e.id === params.id);
  const [saved, setSaved] = useState(false);

  if (!event) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <h2 className="font-semibold text-[var(--text)]">Événement introuvable</h2>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/dashboard/events">Retour à la liste</Link>
        </Button>
      </motion.div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/events" className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight">Modifier l&apos;événement</h1>
            <p className="text-xs text-[var(--text-secondary)]">{event.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/event/${event.slug}`}>
              <ExternalLink className="w-3.5 h-3.5" />
              Voir
            </Link>
          </Button>
          <Button variant="danger" size="sm" className="gap-1.5">
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
          <Button variant="primary" size="sm" className="gap-1.5" onClick={handleSave}>
            {saved ? "✓ Enregistré" : <><Save className="w-4 h-4" /> Enregistrer</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)]">
            <h2 className="font-semibold text-[var(--text)]">Informations</h2>
            <Input label="Titre" defaultValue={event.title} />
            <Input label="Lieu" defaultValue={event.location} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date" defaultValue={formatShortDate(event.startDate)} />
              <Input label="Ville" defaultValue={event.city} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Description</label>
              <textarea
                defaultValue={event.description}
                className="w-full h-32 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] resize-none"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-5 shadow-[var(--shadow)]">
            <h2 className="font-semibold text-[var(--text)]">Billets</h2>
            {event.tickets?.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                <div>
                  <p className="font-semibold text-sm text-[var(--text)]">{ticket.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{ticket.remaining} / {ticket.total} restants</p>
                </div>
                <span className="font-bold text-[var(--brand)]">{ticket.price === 0 ? "Gratuit" : formatCurrency(ticket.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow)]">
            <h2 className="font-semibold text-sm text-[var(--text)] mb-3">Aperçu</h2>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 ring-1 ring-[var(--border)]">
              <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Statut</span><Badge variant={event.isFavorited ? "success" : "warning"}>{event.isFavorited ? "Approuvé" : "En attente"}</Badge></div>
              <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Vues</span><span className="text-[var(--text)] font-medium">{event.views.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Favoris</span><span className="text-[var(--text)] font-medium">{event.favoritesCount}</span></div>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--brand-subtle)]/50 border border-[var(--brand)]/10 p-5">
            <p className="text-xs font-semibold text-[var(--brand-text)] uppercase tracking-wider mb-1">Statut de modération</p>
            <p className="text-xs text-[var(--text-secondary)]">
              {event.isFavorited
                ? "Cet événement est approuvé et visible par tous."
                : "Cet événement est en attente de validation par un modérateur."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
