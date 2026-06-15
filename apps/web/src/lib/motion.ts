import { type Variants, type Transition } from "framer-motion";

// ─── Easing Curves ────────────────────────────────────────────────
export const ease = {
  snappy: [0.2, 0, 0, 1],
  emphasized: [0.05, 0.7, 0.1, 1],
  accelerate: [0.3, 0, 1, 1],
  apple: [0.25, 0.1, 0.25, 1],
  bounce: [0.175, 0.885, 0.32, 1.275],
  decelerate: [0.0, 0.0, 0.2, 1],
} as const;

// ─── Durations (seconds) ─────────────────────────────────────────
export const duration = {
  micro: 0.15,
  quick: 0.2,
  standard: 0.35,
  slow: 0.45,
  dramatic: 0.6,
} as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 20,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// ─── Default transition shortcut ──────────────────────────────────
export const defaultTransition: Transition = {
  duration: duration.standard,
  ease: ease.emphasized,
};

// ─── Shared Variants ──────────────────────────────────────────────

/** Standard entrance: fades up 16px in 350ms with emphasized ease */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.standard, ease: ease.emphasized },
  },
};

/** Slower, longer entrance */
export const fadeUpSlow: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
};

/** Fast, subtle entrance (micro-interactions) */
export const fadeUpMicro: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.quick, ease: ease.snappy },
  },
};

/** Scale entrance for emphasis */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.standard, ease: ease.emphasized },
  },
};

/** Scale pop (for success states, heart toggle) */
export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 600, damping: 15 },
  },
};

/** Slide-up from bottom (mobile sheets, modals) */
export const slideUp: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    y: "100%",
    transition: { duration: duration.quick, ease: ease.accelerate },
  },
};

/** Fade only (for overlays, backdrops) */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.quick, ease: ease.snappy },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.micro, ease: ease.accelerate },
  },
};

// ─── Stagger Helpers ──────────────────────────────────────────────

export function containerStagger(
  stagger: number = 0.06,
  delay: number = 0.1,
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Pre-built container with default stagger (0.06) */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

/** Slower stagger (for hero sections) */
export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

/** Fast stagger (for dense lists) */
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
};
