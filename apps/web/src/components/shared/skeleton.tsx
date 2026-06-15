"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-lg bg-[var(--border-subtle)] animate-pulse", className)}
      aria-hidden="true"
    />
  );
}

interface SkeletonCardProps {
  variant?: "standard" | "compact";
}

export function SkeletonCard({ variant = "standard" }: SkeletonCardProps) {
  if (variant === "compact") {
    return (
      <div className="flex gap-3 p-3">
        <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

interface ContentTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}

export function ContentTransition({ isLoading, children, skeleton }: ContentTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.05, 0.7, 0.1, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
