import { ThemeId, ThemeDefinition } from '@/types/theme';

// Complete theme definitions with color palettes
export const themes: Record<ThemeId, ThemeDefinition> = {
  // === LIGHT (Default) ===
  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright default theme',
    icon: '☀️',
    colorScheme: 'light',
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: '#EFECE6',
      foreground: '#1A1A1A',
      foregroundMuted: '#718096',
      card: '#FFFFFF',
      cardForeground: '#1A1A1A',
      cardBorder: '#E2E8F0',
      primary: '#9EDCE1',
      primaryForeground: '#FFFFFF',
      accent: '#9EDCE1',
      accentForeground: '#1A1A1A',
      border: '#E2E8F0',
      input: '#F7FAFC',
      ring: '#9EDCE1',
      destructive: '#EF4444',
      muted: '#F7FAFC',
      mutedForeground: '#718096',
    },
  },

  // === DARK ===
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes for night reading',
    icon: '🌙',
    colorScheme: 'dark',
    colors: {
      background: '#0A0A0A',
      backgroundSecondary: '#1A1A1A',
      foreground: '#E2E8F0',
      foregroundMuted: '#A0AEC0',
      card: '#1A1A1A',
      cardForeground: '#E2E8F0',
      cardBorder: '#2D3748',
      primary: '#7DC5CA',
      primaryForeground: '#0A0A0A',
      accent: '#7DC5CA',
      accentForeground: '#0A0A0A',
      border: '#2D3748',
      input: '#2D3748',
      ring: '#7DC5CA',
      destructive: '#F87171',
      muted: '#2D3748',
      mutedForeground: '#A0AEC0',
    },
  },

  // === OCEAN (Blues and Teals) ===
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calming blues inspired by the sea',
    icon: '🌊',
    colorScheme: 'light',
    colors: {
      background: '#F0F9FF',
      backgroundSecondary: '#E0F2FE',
      foreground: '#0C4A6E',
      foregroundMuted: '#0369A1',
      card: '#FFFFFF',
      cardForeground: '#0C4A6E',
      cardBorder: '#BAE6FD',
      primary: '#0891B2',
      primaryForeground: '#FFFFFF',
      accent: '#06B6D4',
      accentForeground: '#FFFFFF',
      border: '#BAE6FD',
      input: '#F0F9FF',
      ring: '#0891B2',
      destructive: '#DC2626',
      muted: '#E0F2FE',
      mutedForeground: '#0369A1',
    },
  },

  // === FOREST (Greens) ===
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens for a refreshing feel',
    icon: '🌲',
    colorScheme: 'light',
    colors: {
      background: '#F0FDF4',
      backgroundSecondary: '#DCFCE7',
      foreground: '#14532D',
      foregroundMuted: '#166534',
      card: '#FFFFFF',
      cardForeground: '#14532D',
      cardBorder: '#BBF7D0',
      primary: '#16A34A',
      primaryForeground: '#FFFFFF',
      accent: '#22C55E',
      accentForeground: '#FFFFFF',
      border: '#BBF7D0',
      input: '#F0FDF4',
      ring: '#16A34A',
      destructive: '#DC2626',
      muted: '#DCFCE7',
      mutedForeground: '#166534',
    },
  },

  // === SUNSET (Warm Oranges/Reds) ===
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm colors for a cozy atmosphere',
    icon: '🌅',
    colorScheme: 'light',
    colors: {
      background: '#FFFBEB',
      backgroundSecondary: '#FEF3C7',
      foreground: '#78350F',
      foregroundMuted: '#92400E',
      card: '#FFFFFF',
      cardForeground: '#78350F',
      cardBorder: '#FDE68A',
      primary: '#F59E0B',
      primaryForeground: '#FFFFFF',
      accent: '#FB923C',
      accentForeground: '#FFFFFF',
      border: '#FDE68A',
      input: '#FFFBEB',
      ring: '#F59E0B',
      destructive: '#DC2626',
      muted: '#FEF3C7',
      mutedForeground: '#92400E',
    },
  },

  // === LAVENDER (Purples) ===
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    description: 'Soft purples for elegant reading',
    icon: '💜',
    colorScheme: 'light',
    colors: {
      background: '#FAF5FF',
      backgroundSecondary: '#F3E8FF',
      foreground: '#581C87',
      foregroundMuted: '#7C3AED',
      card: '#FFFFFF',
      cardForeground: '#581C87',
      cardBorder: '#E9D5FF',
      primary: '#8B5CF6',
      primaryForeground: '#FFFFFF',
      accent: '#A78BFA',
      accentForeground: '#FFFFFF',
      border: '#E9D5FF',
      input: '#FAF5FF',
      ring: '#8B5CF6',
      destructive: '#DC2626',
      muted: '#F3E8FF',
      mutedForeground: '#7C3AED',
    },
  },

  // === MONOCHROME (Grayscale) ===
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Distraction-free grayscale design',
    icon: '⬛',
    colorScheme: 'light',
    colors: {
      background: '#FAFAFA',
      backgroundSecondary: '#F4F4F5',
      foreground: '#18181B',
      foregroundMuted: '#52525B',
      card: '#FFFFFF',
      cardForeground: '#18181B',
      cardBorder: '#E4E4E7',
      primary: '#3F3F46',
      primaryForeground: '#FFFFFF',
      accent: '#52525B',
      accentForeground: '#FFFFFF',
      border: '#E4E4E7',
      input: '#FAFAFA',
      ring: '#3F3F46',
      destructive: '#71717A',
      muted: '#F4F4F5',
      mutedForeground: '#71717A',
    },
  },

  // === HIGH CONTRAST (Accessibility) ===
  highContrast: {
    id: 'highContrast',
    name: 'High Contrast',
    description: 'Maximum readability for accessibility',
    icon: '👁️',
    colorScheme: 'light',
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: '#F0F0F0',
      foreground: '#000000',
      foregroundMuted: '#1A1A1A',
      card: '#FFFFFF',
      cardForeground: '#000000',
      cardBorder: '#000000',
      primary: '#0000EE',
      primaryForeground: '#FFFFFF',
      accent: '#0000EE',
      accentForeground: '#FFFFFF',
      border: '#000000',
      input: '#FFFFFF',
      ring: '#0000EE',
      destructive: '#CC0000',
      muted: '#F0F0F0',
      mutedForeground: '#333333',
    },
  },
};

// Export as array for iteration
export const themeList: ThemeDefinition[] = Object.values(themes);

// Get theme by ID with fallback to light
export function getTheme(id: ThemeId): ThemeDefinition {
  return themes[id] || themes.light;
}

// Default theme
export const defaultTheme: ThemeId = 'light';
