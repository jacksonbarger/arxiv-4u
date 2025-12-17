'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { ThemeId, ThemeContextType, ThemeDefinition } from '@/types/theme';
import { themes, themeList, defaultTheme, getTheme } from '@/lib/themes';

// Legacy type alias for backward compatibility
type Theme = 'light' | 'dark';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Convert kebab-case to camelCase CSS variable name
function toCssVarName(key: string): string {
  return `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}

// Apply theme colors as CSS custom properties
function applyThemeToDOM(definition: ThemeDefinition) {
  const root = document.documentElement;

  // Set color scheme for browser (affects scrollbars, form controls, etc.)
  root.style.colorScheme = definition.colorScheme;

  // Apply all CSS custom properties
  Object.entries(definition.colors).forEach(([key, value]) => {
    root.style.setProperty(toCssVarName(key), value);
  });

  // Update class for Tailwind dark mode compatibility
  root.classList.remove('light', 'dark');
  root.classList.add(definition.colorScheme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeId | null;
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (stored && themes[stored]) {
      // Use stored theme if valid
      setThemeState(stored);
    } else if (systemPrefersDark) {
      // Fall back to dark theme if system prefers it
      setThemeState('dark');
    }

    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const definition = getTheme(theme);
    applyThemeToDOM(definition);

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeId) => {
    if (themes[newTheme]) {
      setThemeState(newTheme);
    }
  };

  // Legacy toggle for backward compatibility (cycles light <-> dark)
  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Get current theme definition
  const themeDefinition = getTheme(theme);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeDefinition,
        setTheme,
        toggleTheme,
        availableThemes: themeList,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Legacy helper to check if current theme is dark
export function useIsDark(): boolean {
  const { themeDefinition } = useTheme();
  return themeDefinition.colorScheme === 'dark';
}
