"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300",
  error: "border-red-200 bg-red-50 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300",
  info: "border-[var(--brand)]/20 bg-[var(--brand-subtle)] text-[var(--brand-text)]",
  warning: "border-[var(--accent)]/20 bg-[var(--accent-subtle)] text-[var(--accent)] dark:bg-[var(--accent-subtle)]/20 dark:border-rose-800 dark:text-rose-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }}
                className={cn(
                  "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm",
                  styles[t.type],
                )}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium flex-1">{t.message}</p>
                <button onClick={() => remove(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
