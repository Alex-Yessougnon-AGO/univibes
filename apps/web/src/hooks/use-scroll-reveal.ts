"use client";

import { useEffect } from "react";

/**
 * useScrollReveal — IntersectionObserver-based scroll reveal hook.
 *
 * Add `reveal` CSS class to any element you want to animate into view.
 * The element fades up when it enters the viewport.
 *
 * CSS classes are in globals.css:
 * - .reveal       → initial hidden state (opacity: 0, translateY: 32px)
 * - .revealed     → visible state (opacity: 1, translateY: 0)
 * - .reveal-stagger → child stagger delays via nth-child
 *
 * Usage:
 * ```tsx
 * useScrollReveal();
 * <section className="reveal">...</section>
 * ```
 */
export function useScrollReveal(threshold = 0.1, rootMargin = "0px 0px -40px 0px") {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe existing elements
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Watch for dynamically added elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList?.contains("reveal")) {
              observer.observe(node);
            }
            node.querySelectorAll?.(".reveal").forEach((el) => observer.observe(el));
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [threshold, rootMargin]);
}
