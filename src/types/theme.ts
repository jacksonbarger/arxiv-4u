// Theme identifier - unique string key for each theme
export type ThemeId =
  | 'light'
  | 'dark'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'lavender'
  | 'monochrome'
  | 'highContrast';

// Complete color palette for a theme
export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  foreground: string;
  foregroundMuted: string;
  card: string;
  cardForeground: string;
  cardBorder: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  muted: string;
  mutedForeground: string;
}

// Theme metadata
export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  colorScheme: 'light' | 'dark';
  colors: ThemeColors;
}

// Context type with expanded API
export interface ThemeContextType {
  theme: ThemeId;
  themeDefinition: ThemeDefinition;
  setTheme: (theme: ThemeId) => void;
  toggleTheme: () => void; // Legacy toggle for light/dark
  availableThemes: ThemeDefinition[];
}
