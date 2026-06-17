"use client";
import { useTranslations } from "next-intl";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, CreditCard, Smartphone, ArrowRight, Sparkles, X, Minus, Plus } from "lucide-react";
import { CategoryIcon } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { EVENTS } from "@/lib/mock-data";
import { formatFullDate, formatCurrency, cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "fedapay", name: "FedaPay", icon: CreditCard, description: "Carte bancaire ou Mobile Money" },
  { id: "kkiapay", name: "Kkiapay", icon: Smartphone, description: "Mobile Money (MTN, Moov, Celtiis)" },
  { id: "orange", name: "Orange Money", icon: Smartphone, description: "Orange Money" },
  { id: "mtn", name: "MTN Mobile Money", icon: Smartphone, description: "MoMo" },
];

export default function CheckoutPage() {
  const t = useTranslations();
  const params = useParams();
  const event = EVENTS.find((e) => e.slug === params.eventId);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [step, setStep] = useState<"ticket" | "payment" | "confirm">("ticket");
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  if (!event) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg)]">
        <h2 className="font-semibold text-[var(--text)]">{t("common.search")} introuvable</h2>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/explore">{t("common.back")}</Link>
        </Button>
      </div>
    );
  }

  const ticket = event.tickets?.find((t) => t.id === selectedTicket);
  const total = ticket ? ticket.price * quantity : 0;

  const handlePay = async () => {
    setLoading(true);
    setPaymentError(false);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      if (Math.random() < 0.05) throw new Error("Paiement refusé");
      setLoading(false);
      setStep("confirm");
    } catch {
      setLoading(false);
      setPaymentError(true);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28 md:pb-0">
        <section className="relative pt-6 pb-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand)]/6 to-transparent pointer-events-none" />

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] border border-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand-text)] tracking-wide mb-4">
                {step === "confirm" ? <Check className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                {step === "confirm" ? t("checkout.confirmed") : step === "payment" ? t("checkout.paymentMethod") : t("checkout.title")}
              </span>
              <h1 className="text-[28px] font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight leading-tight">
                {step === "confirm" ? t("checkout.confirmed") : t("checkout.title")}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{event.title}</p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-12">
          <AnimatePresence mode="wait">
            {step === "confirm" ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-sm)]">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight mb-2">
                  {quantity > 1 ? t("checkout.quantity") : t("checkout.confirmed")}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed mb-8">
                  {t("checkout.confirmedDesc")}
                </p>

                <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 text-left shadow-[var(--shadow)] mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--brand-subtle)] flex items-center justify-center">
                      <CategoryIcon name={event.category.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text)]">{event.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">{formatFullDate(event.startDate)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">                    <span className="text-[var(--text-tertiary)]">{t("checkout.chooseTicket")}</span><span className="text-[var(--text)] font-medium">{ticket?.name}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">{t("checkout.quantity")}</span><span className="text-[var(--text)] font-medium">{quantity}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">{t("checkout.total")}</span><span className="text-lg font-extrabold text-[var(--brand)]">{formatCurrency(total)}</span></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" size="md" asChild>
                    <Link href="/tickets">{t("checkout.seeTickets")}</Link>
                  </Button>
                  <Button variant="primary" size="md" asChild>
                    <Link href="/explore">
                      <span className="hidden sm:inline">{t("home.discoverEvents")}</span>
                      <span className="sm:hidden">{t("nav.explore")}</span>
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
                className="space-y-6"
              >
                {/* Step 1: Choose ticket */}
                {step === "ticket" && (
                  <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-4">
                    <h2 className="font-semibold text-[var(--text)]">{t("checkout.chooseTicket")}</h2>
                    {event.tickets?.map((tk) => (
                      <button
                        key={tk.id}
                        onClick={() => { setSelectedTicket(tk.id); setQuantity(1); }}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                          selectedTicket === tk.id
                            ? "border-[var(--brand)] bg-[var(--brand-subtle)]"
                            : "border-[var(--border)] hover:border-[var(--brand)]/30"
                        )}
                      >
                        <div>
                          <h3 className="font-semibold text-sm text-[var(--text)]">{tk.name}</h3>
                          {tk.description && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{tk.description}</p>}
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">{tk.remaining} / {tk.total} {t("event.tickets")}</p>
                        </div>
                        <span className={cn("font-bold text-base", tk.price === 0 ? "text-emerald-600" : "text-[var(--brand)]")}>
                          {tk.price === 0 ? t("event.free") : formatCurrency(tk.price)}
                        </span>
                      </button>
                    ))}

                    {selectedTicket && ticket && (
                      <div className="pt-4 border-t border-[var(--border)] space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--border-subtle)]">
                          <span className="text-sm font-medium text-[var(--text)]">{t("checkout.quantity")}</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              disabled={quantity <= 1}
                              className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--border-subtle)] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold text-[var(--text)] tabular-nums">{quantity}</span>
                            <button
                              onClick={() => setQuantity(Math.min(ticket.remaining, quantity + 1))}
                              disabled={quantity >= ticket.remaining}
                              className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--border-subtle)] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)]">{t("checkout.total")}</span>
                          <span className="text-xl font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">
                            {formatCurrency(total)}
                          </span>
                        </div>

                        <Button variant="primary" size="lg" className="w-full" onClick={() => setStep("payment")}>
                          {t("checkout.continue")}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Payment method */}
                {step === "payment" && (
                  <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] space-y-4">
                    <h2 className="font-semibold text-[var(--text)]">{t("checkout.paymentMethod")}</h2>
                    <p className="text-sm text-[var(--text-secondary)]">{t("checkout.selectPayment")}</p>

                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                          paymentMethod === method.id
                            ? "border-[var(--brand)] bg-[var(--brand-subtle)]"
                            : "border-[var(--border)] hover:border-[var(--brand)]/30"
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[var(--border-subtle)] flex items-center justify-center">
                          <method.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-[var(--text)]">{method.name}</h3>
                          <p className="text-xs text-[var(--text-secondary)]">{method.description}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <Check className="w-5 h-5 text-[var(--brand)]" />
                        )}
                      </button>
                    ))}

                    <div className="pt-4 border-t border-[var(--border)] space-y-4">
                      <div className="rounded-xl bg-[var(--border-subtle)] p-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Billet</span><span className="text-[var(--text)] font-medium">{ticket?.name} × {quantity}</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Sous-total</span><span className="text-[var(--text)] font-medium">{formatCurrency(total)}</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-tertiary)]">Frais</span><span className="text-[var(--text)] font-medium">{t("event.free")}</span></div>
                        <div className="flex justify-between pt-2 border-t border-[var(--border)]">
                          <span className="font-semibold text-[var(--text)]">{t("checkout.total")}</span>
                          <span className="text-lg font-extrabold text-[var(--brand)] font-[family-name:var(--font-display)]">{formatCurrency(total)}</span>
                        </div>
                      </div>

                      {paymentError && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40"
                        >
                          <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                              <p className="text-sm font-semibold text-red-700 dark:text-red-400">{t("checkout.pay", { amount: "" })} refusé</p>
                            <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-0.5">
                                {t("checkout.cancelledDesc")}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex gap-3">
                          <Button variant="outline" size="md" className="flex-1" onClick={() => setStep("ticket")}>
                          {t("common.back")}
                        </Button>
                        <Button
                          variant="primary"
                          size="md"
                          className="flex-1"
                          onClick={handlePay}
                          disabled={!paymentMethod || loading}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              {t("checkout.processing")}
                            </span>
                          ) : (
                            <>{t("checkout.pay", { amount: formatCurrency(total) })}</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
