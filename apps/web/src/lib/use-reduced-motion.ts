import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

export function useReducedMotion() {
  return useFramerReducedMotion();
}

export function useSafeTransition(
  withMotion: { duration?: number; ease?: [number, number, number, number] } = {},
) {
  const prefersReduced = useFramerReducedMotion();
  if (prefersReduced) return { duration: 0 };
  return withMotion;
}
