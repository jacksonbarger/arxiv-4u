'use client';

import { useReaderMode } from '@/contexts/ReaderModeContext';
import { useState } from 'react';

export function ReaderModeControls() {
  const {
    fontSize,
    fontFamily,
    lineHeight,
    isReaderMode,
    setFontSize,
    setFontFamily,
    setLineHeight,
    toggleReaderMode,
    resetSettings,
  } = useReaderMode();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Control Panel */}
      {isOpen && (
        <div
          className="mb-4 rounded-2xl shadow-2xl p-6 backdrop-blur-xl border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderColor: '#E2E8F0',
            minWidth: '320px',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                style={{ color: '#9EDCE1' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="font-semibold" style={{ color: '#4A5568' }}>
                Reading Settings
              </h3>
            </div>
            <button
              onClick={resetSettings}
              className="text-xs px-3 py-1 rounded-full transition-colors"
              style={{
                backgroundColor: '#EFECE6',
                color: '#718096',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2E8F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#EFECE6';
              }}
            >
              Reset
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: '#4A5568' }}>
              Font Size
            </label>
            <div className="flex gap-2">
              {[
                { value: 'small' as const, label: 'A', size: 'text-xs' },
                { value: 'medium' as const, label: 'A', size: 'text-sm' },
                { value: 'large' as const, label: 'A', size: 'text-base' },
                { value: 'xlarge' as const, label: 'A', size: 'text-lg' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`flex-1 py-3 rounded-xl font-semibold ${option.size} transition-all`}
                  style={{
                    backgroundColor: fontSize === option.value ? '#9EDCE1' : '#F5F3EF',
                    color: fontSize === option.value ? '#FFFFFF' : '#718096',
                    border: fontSize === option.value ? 'none' : '1px solid #E2E8F0',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: '#4A5568' }}>
              Font Family
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFontFamily('sans')}
                className="flex-1 py-3 rounded-xl font-medium text-sm transition-all"
                style={{
                  backgroundColor: fontFamily === 'sans' ? '#9EDCE1' : '#F5F3EF',
                  color: fontFamily === 'sans' ? '#FFFFFF' : '#718096',
                  border: fontFamily === 'sans' ? 'none' : '1px solid #E2E8F0',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Sans Serif
              </button>
              <button
                onClick={() => setFontFamily('serif')}
                className="flex-1 py-3 rounded-xl font-medium text-sm transition-all"
                style={{
                  backgroundColor: fontFamily === 'serif' ? '#9EDCE1' : '#F5F3EF',
                  color: fontFamily === 'serif' ? '#FFFFFF' : '#718096',
                  border: fontFamily === 'serif' ? 'none' : '1px solid #E2E8F0',
                  fontFamily: 'Georgia, serif',
                }}
              >
                Serif
              </button>
            </div>
          </div>

          {/* Line Height */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: '#4A5568' }}>
              Line Spacing
            </label>
            <div className="flex gap-2">
              {[
                { value: 'compact' as const, label: 'Compact' },
                { value: 'normal' as const, label: 'Normal' },
                { value: 'relaxed' as const, label: 'Relaxed' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLineHeight(option.value)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm transition-all"
                  style={{
                    backgroundColor: lineHeight === option.value ? '#9EDCE1' : '#F5F3EF',
                    color: lineHeight === option.value ? '#FFFFFF' : '#718096',
                    border: lineHeight === option.value ? 'none' : '1px solid #E2E8F0',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reader Mode Toggle */}
          <div className="pt-4 border-t" style={{ borderColor: '#E2E8F0' }}>
            <button
              onClick={toggleReaderMode}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: isReaderMode ? '#9EDCE1' : '#F5F3EF',
                color: isReaderMode ? '#FFFFFF' : '#4A5568',
                border: isReaderMode ? 'none' : '1px solid #E2E8F0',
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isReaderMode
                    ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  }
                />
              </svg>
              {isReaderMode ? 'Exit Reader Mode' : 'Enter Reader Mode'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          backgroundColor: isOpen ? '#9EDCE1' : '#FFFFFF',
          border: '1px solid #E2E8F0',
        }}
        aria-label="Reading settings"
      >
        <svg
          className="w-6 h-6"
          style={{ color: isOpen ? '#FFFFFF' : '#4A5568' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </button>
    </div>
  );
}
