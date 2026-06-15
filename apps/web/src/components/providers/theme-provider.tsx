"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useServerInsertedHTML } from "next/navigation";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  mounted: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  return null;
}

// Inline script to prevent FOUC — injected via useServerInsertedHTML (no React warning)
const THEME_SCRIPT = `
(function() {
  var theme = localStorage.getItem('theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();
`;

export function ThemeProvider({
  children,
  defaultTheme = "light",
  enableSystem = true,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Inject script via useServerInsertedHTML — this runs during SSR and avoids the React 19 warning
  useServerInsertedHTML(() => {
    return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
  });

  // On mount, read the stored or system theme
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setThemeState(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else if (enableSystem) {
      const system = getSystemTheme();
      setThemeState(system);
      document.documentElement.classList.toggle("dark", system === "dark");
    }
    setMounted(true);
  }, [enableSystem]);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (!getStoredTheme()) {
        const system = getSystemTheme();
        setThemeState(system);
        document.documentElement.classList.toggle("dark", system === "dark");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [enableSystem]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try { localStorage.setItem("theme", newTheme); } catch {}
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
