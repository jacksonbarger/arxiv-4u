'use client';

import { CSSProperties } from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  width = '100%',
  height = 20,
  className = '',
  variant = 'rectangular',
  animation = 'wave',
}: SkeletonProps) {
  const style: CSSProperties = {
    width,
    height,
    backgroundColor: '#E2E8F0',
    borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? '4px' : '8px',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div className={`${className} ${animation === 'pulse' ? 'animate-pulse' : ''}`} style={style}>
      {animation === 'wave' && (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
            animation: 'shimmer 2s infinite',
          }}
        />
      )}
    </div>
  );
}

// Add shimmer animation to globals.css
export function SkeletonPaper() {
  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
    >
      <div className="flex gap-4">
        <Skeleton variant="rectangular" width={100} height={100} />
        <div className="flex-1">
          <Skeleton width="80%" height={24} className="mb-3" />
          <Skeleton width="60%" height={16} className="mb-2" />
          <Skeleton width="90%" height={14} className="mb-2" />
          <Skeleton width="85%" height={14} className="mb-4" />
          <div className="flex gap-2">
            <Skeleton width={80} height={24} />
            <Skeleton width={60} height={24} />
            <Skeleton width={70} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonPaperCard() {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
    >
      <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <Skeleton width={80} height={24} />
          <Skeleton width={60} height={24} />
        </div>
        <Skeleton width="90%" height={28} className="mb-3" />
        <Skeleton width="95%" height={20} className="mb-2" />
        <Skeleton width="88%" height={20} className="mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton width={120} height={20} />
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPaperCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPaper key={i} />
      ))}
    </div>
  );
}
