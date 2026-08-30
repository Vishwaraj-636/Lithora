import { useState, useEffect } from "react";

/**
 * Shared dark-mode hook for Meera M&G.
 * Persists to localStorage under 'meera-mg-theme'.
 * Toggles the 'dark' class on <html>.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("meera-mg-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("meera-mg-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("meera-mg-theme", "light");
    }
  }, [isDark]);

  return [isDark, () => setIsDark((v) => !v)];
}
