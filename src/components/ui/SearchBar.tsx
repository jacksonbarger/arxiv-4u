'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSettingsClick?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSettingsClick,
  placeholder = 'Search papers...',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center gap-3">
      {/* Search input container */}
      <div
        className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
        style={{
          backgroundColor: isFocused ? '#FFFFFF' : '#EFECE6',
          boxShadow: isFocused ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          border: isFocused ? '2px solid #C0E5E8' : '2px solid transparent',
        }}
      >
        {/* Search icon */}
        <svg
          className="w-5 h-5 flex-shrink-0"
          style={{ color: '#718096' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm focus:outline-none"
          style={{ color: '#4A5568' }}
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1 rounded-full transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DEEBEB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg
              className="w-4 h-4"
              style={{ color: '#718096' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search button */}
      <button
        onClick={() => inputRef.current?.focus()}
        className="px-5 py-3 rounded-2xl text-sm font-medium transition-colors"
        style={{ backgroundColor: '#9EDCE1', color: '#4A5568' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C0E5E8'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9EDCE1'}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
