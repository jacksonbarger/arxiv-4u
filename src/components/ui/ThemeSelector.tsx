'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeId } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeIconToggle, ThemeIconDual } from './ThemeIcons';

export function ThemeSelector() {
  const { theme, themeDefinition, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleThemeSelect = (themeId: ThemeId) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button with hover-toggle pill icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: isOpen
            ? themeDefinition.colors.backgroundSecondary
            : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor =
              themeDefinition.colors.backgroundSecondary;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <ThemeIconToggle
          theme={theme}
          defaultVariant={themeDefinition.colorScheme}
          size={26}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown panel - compact grid layout */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 mt-2 rounded-xl shadow-xl z-20 overflow-hidden"
              style={{
                backgroundColor: themeDefinition.colors.card,
                border: `1px solid ${themeDefinition.colors.cardBorder}`,
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
              }}
              role="listbox"
              aria-label="Available themes"
            >
              {/* Header */}
              <div
                className="px-4 py-2.5 border-b"
                style={{ borderColor: themeDefinition.colors.border }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: themeDefinition.colors.foregroundMuted }}
                >
                  Theme
                </p>
              </div>

              {/* Grid of themes - 2 columns, 4 rows */}
              <div className="grid grid-cols-2 gap-1 p-2">
                {availableThemes.map((t) => {
                  const isSelected = t.id === theme;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleThemeSelect(t.id)}
                      className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left"
                      style={{
                        color: themeDefinition.colors.foreground,
                        backgroundColor: isSelected
                          ? themeDefinition.colors.primary + '15'
                          : 'transparent',
                        border: isSelected
                          ? `1.5px solid ${themeDefinition.colors.primary}`
                          : '1.5px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor =
                            themeDefinition.colors.backgroundSecondary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {/* Dual pill icons (light + dark variants) */}
                      <ThemeIconDual theme={t.id} size={16} gap={2} />

                      {/* Theme name */}
                      <span className="text-xs font-medium whitespace-nowrap">
                        {t.name}
                      </span>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div
                          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: themeDefinition.colors.primary }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeSelector;
