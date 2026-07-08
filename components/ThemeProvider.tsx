'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type Theme = 'dark' | 'light';
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => {
    const stored = localStorage.getItem('pv-theme') as Theme | null;
    const sys = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const initial = stored || sys;
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);
  const toggle = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pv-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
export const useTheme = () => useContext(ThemeCtx);
