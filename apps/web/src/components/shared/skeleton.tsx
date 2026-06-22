"use client";
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
    <div className="relative">
      {/* Skeleton — always absolute overlay, fades out when loading completes */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isLoading}
      >
        {skeleton}
      </div>
      {/* Content — always in flow, fades in when loaded */}
      <div
        className={`transition-all duration-[350ms] ease-[cubic-bezier(0.05,0.7,0.1,1)] ${
          !isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
