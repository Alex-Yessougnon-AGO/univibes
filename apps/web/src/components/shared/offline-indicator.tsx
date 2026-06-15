"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);

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
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          className="fixed top-0 left-0 right-0 z-[60] bg-amber-600 text-white text-center text-xs font-medium py-2 px-4 flex items-center justify-center gap-2"
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>Connexion perdue — certaines fonctionnalités peuvent ne pas fonctionner</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
