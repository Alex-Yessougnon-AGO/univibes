"use client";
import { ViewTransition } from "react";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" as const }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" as const }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
