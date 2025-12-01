'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
type FontFamily = 'sans' | 'serif';
type LineHeight = 'compact' | 'normal' | 'relaxed';

interface ReaderSettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  isReaderMode: boolean;
}

interface ReaderModeContextType extends ReaderSettings {
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setLineHeight: (height: LineHeight) => void;
  toggleReaderMode: () => void;
  resetSettings: () => void;
}

const defaultSettings: ReaderSettings = {
  fontSize: 'medium',
  fontFamily: 'sans',
  lineHeight: 'normal',
  isReaderMode: false,
};

const ReaderModeContext = createContext<ReaderModeContextType | undefined>(undefined);

export function ReaderModeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('readerSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Failed to parse reader settings:', e);
      }
    }
    setMounted(true);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('readerSettings', JSON.stringify(settings));
  }, [settings, mounted]);

  const setFontSize = (fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const setFontFamily = (fontFamily: FontFamily) => {
    setSettings((prev) => ({ ...prev, fontFamily }));
  };

  const setLineHeight = (lineHeight: LineHeight) => {
    setSettings((prev) => ({ ...prev, lineHeight }));
  };

  const toggleReaderMode = () => {
    setSettings((prev) => ({ ...prev, isReaderMode: !prev.isReaderMode }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ReaderModeContext.Provider
      value={{
        ...settings,
        setFontSize,
        setFontFamily,
        setLineHeight,
        toggleReaderMode,
        resetSettings,
      }}
    >
      {children}
    </ReaderModeContext.Provider>
  );
}

export function useReaderMode() {
  const context = useContext(ReaderModeContext);
  if (context === undefined) {
    throw new Error('useReaderMode must be used within a ReaderModeProvider');
  }
  return context;
}

// Helper functions for getting CSS values
export function getFontSizeValue(size: FontSize): string {
  switch (size) {
    case 'small':
      return '14px';
    case 'medium':
      return '16px';
    case 'large':
      return '18px';
    case 'xlarge':
      return '20px';
  }
}

export function getLineHeightValue(height: LineHeight): string {
  switch (height) {
    case 'compact':
      return '1.4';
    case 'normal':
      return '1.6';
    case 'relaxed':
      return '1.8';
  }
}

export function getFontFamilyValue(family: FontFamily): string {
  switch (family) {
    case 'sans':
      return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    case 'serif':
      return 'Georgia, "Times New Roman", serif';
  }
}
