import { useState, useEffect } from "react";

/**
 * Shared dark-mode hook for WEARTH.
 * Persists to localStorage under 'wearth-theme'.
 */
export function useDarkMode() {
   const [isDarkMode, setIsDarkMode] = useState(() => {
      // 1. Check local storage
      const stored = localStorage.getItem("wearth-theme");
      if (stored) {
         return stored === "dark";
      }
      // 2. Fall back to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
   });

   useEffect(() => {
      const root = window.document.documentElement;
      if (isDarkMode) {
         root.classList.add("dark");
         localStorage.setItem("wearth-theme", "dark");
      } else {
         root.classList.remove("dark");
         localStorage.setItem("wearth-theme", "light");
      }
   }, [isDarkMode]);

   return [isDarkMode, () => setIsDarkMode((v) => !v)];
}
