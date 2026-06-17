"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { containerStagger, fadeUp } from "@/lib/motion";
import { ChevronLeft, FileText, Printer, Mail, CheckCircle, Clock, XCircle, RotateCcw, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { EVENTS } from "@/lib/mock-data";
import { formatCurrency, formatFullDate, cn, getInitials } from "@/lib/utils";

type InvoiceStatus = "paid" | "pending" | "cancelled" | "refunded";

type InvoiceItem = {
  ticketName: string;
  quantity: number;
  unitPrice: number;
};

type Invoice = {
  id: string;
  orderNumber: string;
  date: string;
  status: InvoiceStatus;
  eventId: string;
  items: InvoiceItem[];
  paymentMethod: string;
  paymentReference: string;
};

const MOCK_INVOICES: Invoice[] = [
  {
    id: "t1",
    orderNumber: "UNV-2025-0042",
    date: "2025-03-15T14:30:00",
    status: "paid",
    eventId: "evt-2",
    items: [{ ticketName: "Participant", quantity: 1, unitPrice: 0 }],
    paymentMethod: "Mobile Money (MTN)",
    paymentReference: "MTN-REF-8842",
  },
  {
    id: "t2",
    orderNumber: "UNV-2025-0037",
    date: "2025-02-20T10:15:00",
    status: "paid",
    eventId: "evt-7",
    items: [{ ticketName: "Étudiant", quantity: 2, unitPrice: 1500 }],
    paymentMethod: "Carte bancaire",
    paymentReference: "CARD-7F3A-21B9",
  },
  {
    id: "t3",
    orderNumber: "UNV-2025-0021",
    date: "2025-01-10T18:45:00",
    status: "paid",
    eventId: "evt-1",
    items: [{ ticketName: "VIP", quantity: 1, unitPrice: 15000 }],
    paymentMethod: "Mobile Money (Moov)",
    paymentReference: "MOOV-REF-5519",
  },
];

const statusConfig: Record<InvoiceStatus, { variant: "success" | "warning" | "error" | "gold"; icon: typeof CheckCircle }> = {
  paid: { variant: "success", icon: CheckCircle },
  pending: { variant: "warning", icon: Clock },
  cancelled: { variant: "error", icon: XCircle },
  refunded: { variant: "gold", icon: RotateCcw },
};

export default function InvoicePage() {
  const t = useTranslations();
  const params = useParams();
  const invoice = MOCK_INVOICES.find((inv) => inv.id === params.id);

  if (!invoice) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg)]">
        <h2 className="font-semibold text-[var(--text)]">{t("common.error")}</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">
          {t("invoice.title")} introuvable
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/tickets">{t("nav.tickets")}</Link>
        </Button>
      </div>
    );
  }

  const event = EVENTS.find((e) => e.id === invoice.eventId);
  const subtotal = invoice.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const StatusIcon = statusConfig[invoice.status].icon;
  const statusBadgeVariant = statusConfig[invoice.status].variant;

  const handleSimulatedAction = (action: string) => {
    console.log(`[Invoice] ${action} clicked for ${invoice.orderNumber}`);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28 md:pb-0">
        <section className="relative pt-6 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 via-[var(--accent)]/3 to-transparent pointer-events-none" />

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            >
              <Link
                href="/tickets"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors mb-6 group"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                {t("nav.tickets")}
              </Link>

              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-3">
                    <FileText className="w-3 h-3" />
                    {t("invoice.title")}
                  </span>
                  <h1 className="text-[26px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
                    {t("invoice.orderNumber", { id: invoice.orderNumber })}
                  </h1>
                  {event && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {t("invoice.invoiceFor", { event: event.title })}
                    </p>
                  )}
                </div>
                <Badge variant={statusBadgeVariant} className="shrink-0 gap-1.5 capitalize">
                  <StatusIcon className="w-3 h-3" />
                  {t(`invoice.${invoice.status}`)}
                </Badge>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-12 space-y-5">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerStagger(0.06, 0.05)}
          >
            {/* Brand header */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand)] flex items-center justify-center text-white font-extrabold text-sm font-[family-name:var(--font-display)]">
                    U
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text)] text-sm">{t("common.appName")}</p>
                    <p className="text-[11px] text-[var(--text-tertiary)]">{t("common.appTagline")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[var(--text-tertiary)]">{t("invoice.date")}</p>
                  <p className="text-xs font-medium text-[var(--text)]">{formatFullDate(invoice.date)}</p>
                </div>
              </div>
            </motion.div>

            {/* Event details */}
            {event && (
              <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] mt-4">
                <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                  {t("invoice.event")}
                </h3>
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-[var(--border)]">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.coverImage})` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text)]">{event.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{formatFullDate(event.startDate)}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{event.location}, {event.city}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-[var(--text-tertiary)]">{t("invoice.organizer")}</p>
                    <p className="text-xs font-medium text-[var(--text)]">{event.organizer.name}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Items table */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)] mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--border-subtle)]/40">
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        {t("invoice.ticketType")}
                      </th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        {t("invoice.quantity")}
                      </th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        {t("invoice.unitPrice")}
                      </th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        {t("invoice.subtotal")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-[var(--border)] last:border-b-0">
                        <td className="px-5 py-3.5 text-[var(--text)] font-medium">{item.ticketName}</td>
                        <td className="px-4 py-3.5 text-center text-[var(--text-secondary)]">{item.quantity}</td>
                        <td className="px-4 py-3.5 text-right text-[var(--text-secondary)]">
                          {item.unitPrice === 0 ? t("event.free") : formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-[var(--text)] font-semibold">
                          {item.unitPrice === 0 ? t("event.free") : formatCurrency(item.unitPrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="px-5 py-4 bg-[var(--brand-subtle)]/30 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text)]">{t("invoice.total")}</span>
                <span className="text-lg font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">
                  {subtotal === 0 ? t("event.free") : formatCurrency(subtotal)}
                </span>
              </div>
            </motion.div>

            {/* Payment info */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] mt-4">
              <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                {t("invoice.paymentMethod")}
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">{t("invoice.paymentMethod")}</span>
                  <span className="text-sm font-medium text-[var(--text)]">{invoice.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">{t("invoice.paymentReference")}</span>
                  <span className="text-sm font-mono font-medium text-[var(--text)]">{invoice.paymentReference}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">{t("invoice.status")}</span>
                  <Badge variant={statusBadgeVariant} className="gap-1 capitalize">
                    <StatusIcon className="w-3 h-3" />
                    {t(`invoice.${invoice.status}`)}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleSimulatedAction("downloadPDF")}>
                <FileText className="w-3.5 h-3.5" />
                {t("invoice.downloadPDF")}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleSimulatedAction("print")}>
                <Printer className="w-3.5 h-3.5" />
                {t("invoice.print")}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleSimulatedAction("sendEmail")}>
                <Mail className="w-3.5 h-3.5" />
                {t("invoice.sendEmail")}
              </Button>
            </motion.div>

            {/* Thank you */}
            <motion.div variants={fadeUp} className="mt-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-center mx-auto mb-3 shadow-[var(--shadow-sm)]">
                <Building className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-[var(--text)]">
                {t("invoice.thankYou")}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {t("common.appName")} — {t("common.appTagline")}
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
