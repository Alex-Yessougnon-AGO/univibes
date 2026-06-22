"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Scan, Search, CheckCircle2, XCircle, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EVENTS } from "@/lib/mock-data";
import { formatFullDate, cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

type ScanStatus = "valid" | "alreadyUsed" | "invalid";

type ScanResult = {
  status: ScanStatus;
  code: string;
  ticketName?: string;
  userName?: string;
  quantity?: number;
  timestamp: Date;
};

const MOCK_SCANS: ScanResult[] = [
  { status: "valid", code: "UNV-A7F3K2", ticketName: "Standard", userName: "Koffi A.", quantity: 1, timestamp: new Date(Date.now() - 120000) },
  { status: "valid", code: "UNV-B8E1P9", ticketName: "VIP", userName: "Mariam D.", quantity: 2, timestamp: new Date(Date.now() - 300000) },
  { status: "alreadyUsed", code: "UNV-C2G5R4", ticketName: "Standard", userName: "Jean M.", quantity: 1, timestamp: new Date(Date.now() - 600000) },
];

const scanColors: Record<ScanStatus, { bg: string; border: string; icon: string; text: string }> = {
  valid: { bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200 dark:border-emerald-800/30", icon: "text-emerald-600 dark:text-emerald-400", text: "text-emerald-800 dark:text-emerald-300" },
  alreadyUsed: { bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200 dark:border-amber-800/30", icon: "text-amber-600 dark:text-amber-400", text: "text-amber-800 dark:text-amber-300" },
  invalid: { bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200 dark:border-red-800/30", icon: "text-red-600 dark:text-red-400", text: "text-red-800 dark:text-red-300" },
};

const statusIcons: Record<ScanStatus, React.ReactNode> = {
  valid: <CheckCircle2 className="w-5 h-5" />,
  alreadyUsed: <AlertTriangle className="w-5 h-5" />,
  invalid: <XCircle className="w-5 h-5" />,
};

const statusMessages: Record<ScanStatus, string> = {
  valid: "checkin.valid",
  alreadyUsed: "checkin.alreadyUsed",
  invalid: "checkin.invalid",
};

const statusDescMessages: Record<ScanStatus, string> = {
  valid: "checkin.validDesc",
  alreadyUsed: "checkin.alreadyUsedDesc",
  invalid: "checkin.invalidDesc",
};

export default function CheckinPage() {
  const t = useTranslations();
  const params = useParams();
  useScrollReveal();
  const event = EVENTS.find((e) => e.id === params.id);
  const [scans, setScans] = useState<ScanResult[]>(MOCK_SCANS);
  const [manualCode, setManualCode] = useState("");
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const scannedCount = scans.filter((s) => s.status === "valid").length;

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const simulateScan = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    const existing = scans.find((s) => s.code === normalized);
    if (existing) {
      setLastResult({ ...existing, timestamp: new Date() });
    } else {
      const newScan: ScanResult = {
        status: "valid",
        code: normalized,
        ticketName: "Standard",
        quantity: 1,
        timestamp: new Date(),
      };
      setScans((prev) => [newScan, ...prev]);
      setLastResult(newScan);
    }
    setShowResult(true);
    setManualCode("");
  };

  const handleManualSubmit = () => {
    simulateScan(manualCode);
  };

  const handleScanAgain = () => {
    setShowResult(false);
    setLastResult(null);
    inputRef.current?.focus();
  };

  const filteredRecent = scans
    .filter((s) => s.code.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 10);

  if (!event) {
    return (
      <div
        className="text-center py-20"
      >
        <h2 className="font-semibold text-[var(--text)]">{t("checkin.eventNotFound")}</h2>
        <Button variant="outline" size="sm" className="mt-4 pressable" asChild>
          <Link href="/dashboard/events">{t("common.back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
     
     
      
      className="max-w-2xl mx-auto"
    >
      <div  className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/events/${event.id}`}
          className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--text-secondary)]" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-[family-name:var(--font-display)] text-[var(--text)] tracking-tight truncate">
            {t("checkin.title")}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] truncate">{event.title}</p>
        </div>
        <div className="ml-auto shrink-0">
          <Badge variant="success" className="gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            {scannedCount} {t("checkin.checkedIn")}
          </Badge>
        </div>
      </div>

      {/* Event info bar */}
      <div
        
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--border-subtle)] mb-6 card-hover"
      >
        <Clock className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
        <div className="text-xs text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text)]">{event.title}</span>
          <span className="mx-1.5">·</span>
          {formatFullDate(event.startDate)}
        </div>
      </div>

      <div className="space-y-5">
        {/* QR Scanner */}
        <div
          
          className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-[var(--shadow)] overflow-hidden card-hover"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/5 via-transparent to-[var(--accent)]/5 pointer-events-none" />

          <div className="relative flex flex-col items-center">
            <div className="relative w-56 h-56 rounded-2xl overflow-hidden mb-4 card-hover">
              <div className="absolute inset-0 bg-[var(--text)]/5" />
              <div className="absolute inset-0 m-4 rounded-xl border-2 border-dashed border-[var(--brand)]/30 card-hover" />

              {/* Corner brackets */}
              <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-[var(--brand)] rounded-tl-xl" />
              <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-[var(--brand)] rounded-tr-xl" />
              <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-[var(--brand)] rounded-bl-xl" />
              <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-[var(--brand)] rounded-br-xl" />

              {/* Scan line animation */}
              <div
                className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent"
                />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Scan className="w-10 h-10 text-[var(--brand)]/30" />
              </div>
            </div>

            <h3 className="font-semibold text-sm text-[var(--text)]">{t("checkin.scanning")}</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 text-center max-w-xs">{t("checkin.scanningDesc")}</p>
          </div>
        </div>

        {/* Validation result */}
          {showResult && lastResult && (
            <div
             
             
              className={cn(
                "rounded-2xl border-2 p-5 shadow-[var(--shadow)]",
                scanColors[lastResult.status].bg,
                scanColors[lastResult.status].border
              )}>
              <div className="flex items-start gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", scanColors[lastResult.status].bg)}>
                  <span className={scanColors[lastResult.status].icon}>
                    {statusIcons[lastResult.status]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={cn("font-semibold text-sm", scanColors[lastResult.status].text)}>
                    {t(statusMessages[lastResult.status])}
                  </h3>
                  <p className={cn("text-xs mt-0.5", scanColors[lastResult.status].text, "opacity-80")}>
                    {lastResult.status === "valid"
                      ? `1${t("checkin.validDesc")}`
                      : lastResult.status === "alreadyUsed"
                        ? t("checkin.alreadyUsedDesc") + lastResult.timestamp.toLocaleTimeString()
                        : t("checkin.invalidDesc")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-mono font-semibold text-[var(--text)] tracking-wider bg-[var(--surface)] px-2 py-0.5 rounded">
                      {lastResult.code}
                    </span>
                    {lastResult.ticketName && (
                      <Badge variant="outline" className="text-[10px]">{lastResult.ticketName}</Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleScanAgain}
                  className="shrink-0 w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 rotate-45" />
                </button>
              </div>
            </div>
          )}
        

        {/* Manual entry */}
        <div  className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-[var(--shadow)] card-hover">
          <p className="text-sm font-medium text-[var(--text)] mb-3">{t("checkin.manualEntry")}</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder={t("checkin.manualPlaceholder")}
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleManualSubmit();
                }}
                className="font-mono text-sm uppercase tracking-wider"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleManualSubmit}
              disabled={!manualCode.trim()}
              className="shrink-0 pressable"
            >
              {t("checkin.verify")}
            </Button>
          </div>
        </div>

        {/* Recent scans */}
        <div  className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden card-hover">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="font-semibold text-sm text-[var(--text)] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
              {t("checkin.recentScans")}
              <span className="text-xs font-normal text-[var(--text-tertiary)]">({scans.length})</span>
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {scannedCount} {t("checkin.totalScanned")}
            </div>
          </div>

          <div className="px-5 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                placeholder={t("checkin.searchTicket")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-[var(--border-subtle)] border border-[var(--border)] rounded-lg pl-9 pr-3 text-xs text-[var(--text)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] transition-colors"
              />
            </div>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {filteredRecent.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Scan className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2 opacity-40" />
                <p className="text-xs text-[var(--text-tertiary)]">{t("checkin.scanningDesc")}</p>
              </div>
            ) : (
              filteredRecent.map((scan, i) => (
                <div
                  key={`${scan.code}-${i}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--border-subtle)]/50 transition-colors"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    scan.status === "valid" && "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600",
                    scan.status === "alreadyUsed" && "bg-amber-50 dark:bg-amber-950/20 text-amber-600",
                    scan.status === "invalid" && "bg-red-50 dark:bg-red-950/20 text-red-600",
                  )}>
                    {statusIcons[scan.status]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[var(--text)]">{scan.code}</span>
                      {scan.ticketName && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0">{scan.ticketName}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {scan.userName && (
                        <span className="text-[11px] text-[var(--text-secondary)]">{scan.userName}</span>
                      )}
                      <span className="text-[10px] text-[var(--text-tertiary)]">
                        {scan.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  {scan.quantity && scan.quantity > 1 && (
                    <span className="text-xs text-[var(--text-tertiary)] font-medium">x{scan.quantity}</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
