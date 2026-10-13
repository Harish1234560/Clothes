import { useEffect, useState, useCallback } from 'react';

type Theme = 'paper' | 'ink';

const STORAGE_KEY = 'bookstore-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'paper';
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'paper' || stored === 'ink') return stored;
  return 'paper';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'paper' ? '#F6F1E8' : '#0E0D0B');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'paper' ? 'ink' : 'paper'));
  }, []);

  return { theme, toggleTheme };
}
