'use client';

import { useState } from 'react';
import { ThemeId } from '@/types/theme';

interface ThemeIconProps {
  theme: ThemeId;
  variant: 'light' | 'dark';
  size?: number;
  className?: string;
}

// Pill-shaped badge wrapper for all icons
function PillBadge({
  children,
  variant,
  width = 40,
  height = 24,
}: {
  children: React.ReactNode;
  variant: 'light' | 'dark';
  width?: number;
  height?: number;
}) {
  const bgColor = variant === 'light' ? '#F8FAFC' : '#1E293B';
  const borderColor = variant === 'light' ? '#CBD5E1' : '#475569';

  return (
    <div
      className="flex items-center justify-center transition-all duration-200"
      style={{
        width,
        height,
        backgroundColor: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: height / 2,
      }}
    >
      {children}
    </div>
  );
}

// Minimal Sun icon - single stroke circle with rays
function SunIcon({ variant, size = 14 }: { variant: 'light' | 'dark'; size?: number }) {
  const color = variant === 'light' ? '#F59E0B' : '#FCD34D';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4" y1="12" x2="2" y2="12" />
      <line x1="22" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// Minimal Moon icon - simple crescent
function MoonIcon({ variant, size = 14 }: { variant: 'light' | 'dark'; size?: number }) {
  const color = variant === 'light' ? '#6366F1' : '#C7D2FE';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// Minimal Wave icon - single flowing line
function WaveIcon({ variant, size = 14 }: { variant: 'light' | 'dark'; size?: number }) {
  const color = variant === 'light' ? '#0891B2' : '#67E8F9';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M2 12c2-3 4-4 6-4s4 2 6 4 4 4 6 4" />
    </svg>
  );
}

// Minimal Tree icon - simple triangle pine
function TreeIcon({ variant, size = 14 }: { variant: 'light' | 'dark'; size?: number }) {
  const color = variant === 'light' ? '#16A34A' : '#86EFAC';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L4 15h16L12 3z" />
      <line x1="12" y1="15" x2="12" y2="21" />
    </svg>
  );
}

// Minimal Sunset icon - half sun on horizon
function SunsetIcon({ variant, size = 14 }: { variant: 'light' | 'dark'; size?: number }) {
  const color = variant === 'light' ? '#EA580C' : '#FDBA74';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M7 17a5 5 0 0 1 10 0" />
      <line x1="12" y1="9" x2="12" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

// Minimal Lavender icon - simple petal/drop shape
function LavenderIcon({ variant, size = 14 }: { variant: 'light' | 'dark'; size?: number }) {
  const color = variant === 'light' ? '#7C3AED' : '#C4B5FD';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-3 4-5 7-5 10a5 5 0 0 0 10 0c0-3-2-6-5-10z" />
    </svg>
  );
}

// Minimal Monochrome icon - half-filled circle
function MonochromeIcon({ variant, size = 14 }: { variant: 'light' | 'dark'; size?: number }) {
  const color = variant === 'light' ? '#52525B' : '#A1A1AA';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16" />
    </svg>
  );
}

// Minimal High Contrast icon - simple eye outline
function HighContrastIcon({ variant, size = 14 }: { variant: 'light' | 'dark'; size?: number }) {
  const color = variant === 'light' ? '#18181B' : '#FAFAFA';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <ellipse cx="12" cy="12" rx="9" ry="5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// Get icon component for a theme
function getIconComponent(theme: ThemeId, variant: 'light' | 'dark', size: number) {
  switch (theme) {
    case 'light':
      return <SunIcon variant={variant} size={size} />;
    case 'dark':
      return <MoonIcon variant={variant} size={size} />;
    case 'ocean':
      return <WaveIcon variant={variant} size={size} />;
    case 'forest':
      return <TreeIcon variant={variant} size={size} />;
    case 'sunset':
      return <SunsetIcon variant={variant} size={size} />;
    case 'lavender':
      return <LavenderIcon variant={variant} size={size} />;
    case 'monochrome':
      return <MonochromeIcon variant={variant} size={size} />;
    case 'highContrast':
      return <HighContrastIcon variant={variant} size={size} />;
    default:
      return <SunIcon variant={variant} size={size} />;
  }
}

// Single variant icon in a pill badge
export function ThemeIcon({ theme, variant, size = 24, className }: ThemeIconProps) {
  const iconSize = Math.floor(size * 0.6);
  const pillWidth = size * 1.7;
  const pillHeight = size;

  return (
    <div className={className}>
      <PillBadge variant={variant} width={pillWidth} height={pillHeight}>
        {getIconComponent(theme, variant, iconSize)}
      </PillBadge>
    </div>
  );
}

// Hover-toggle icon: shows one variant, toggles to other on hover
export function ThemeIconToggle({
  theme,
  defaultVariant = 'light',
  size = 28,
  className,
}: {
  theme: ThemeId;
  defaultVariant?: 'light' | 'dark';
  size?: number;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const currentVariant = isHovered
    ? (defaultVariant === 'light' ? 'dark' : 'light')
    : defaultVariant;

  const iconSize = Math.floor(size * 0.5);
  const pillWidth = size * 1.5;
  const pillHeight = size;

  return (
    <div
      className={`cursor-pointer ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <PillBadge variant={currentVariant} width={pillWidth} height={pillHeight}>
        {getIconComponent(theme, currentVariant, iconSize)}
      </PillBadge>
    </div>
  );
}

// Dual icon showing both light and dark variants side by side (for theme selector dropdown)
export function ThemeIconDual({
  theme,
  size = 20,
  gap = 2,
  className,
}: {
  theme: ThemeId;
  size?: number;
  gap?: number;
  className?: string;
}) {
  const iconSize = Math.floor(size * 0.6);
  const pillWidth = size * 1.4;
  const pillHeight = size;

  return (
    <div className={`flex items-center ${className || ''}`} style={{ gap }}>
      <PillBadge variant="light" width={pillWidth} height={pillHeight}>
        {getIconComponent(theme, 'light', iconSize)}
      </PillBadge>
      <PillBadge variant="dark" width={pillWidth} height={pillHeight}>
        {getIconComponent(theme, 'dark', iconSize)}
      </PillBadge>
    </div>
  );
}

export default ThemeIcon;
