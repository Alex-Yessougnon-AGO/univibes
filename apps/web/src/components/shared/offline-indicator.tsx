"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-amber-600 text-white text-center text-xs font-medium py-2 px-4 flex items-center justify-center gap-2 transition-all duration-250 ease-[cubic-bezier(0.2,0,0,1)] ${
        online ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{t("common.offline")}</span>
    </div>
  );
}
