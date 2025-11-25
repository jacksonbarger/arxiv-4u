'use client';

import { useMemo } from 'react';
import { TopicCategory } from '@/types/arxiv';

interface AbstractArtProps {
  paperId?: string;
  category: TopicCategory;
  className?: string;
}

// Deterministic hash
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

// Seeded random generator
function createRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Sandy Beach pastel palette - shared across all categories for cohesive look
// #C0E5E8 - soft aqua
// #EFECE6 - warm cream/beige
// #DAF4EF - mint/seafoam
// #DEEBEB - pale blue-gray
// #9EDCE1 - turquoise
// #EFE4CB - sand/wheat
const SANDY_BEACH_COLORS = [
  '#C0E5E8', // soft aqua
  '#EFECE6', // warm cream
  '#DAF4EF', // mint seafoam
  '#DEEBEB', // pale blue-gray
  '#9EDCE1', // turquoise
  '#EFE4CB', // sand/wheat
];

// Background - warm off-white from palette
const BG_COLOR = '#F5F3EF';

export function AbstractArt({ paperId = 'default', className = '' }: AbstractArtProps) {
  const art = useMemo(() => {
    const seed = hash(paperId);
    const rand = createRandom(seed);
    const id = `art${seed}`;

    const pickColor = () => SANDY_BEACH_COLORS[Math.floor(rand() * SANDY_BEACH_COLORS.length)];

    // Generate squiggly lines
    const squiggles = Array.from({ length: 3 + Math.floor(rand() * 4) }, () => {
      const startX = rand() * 20 - 10;
      const startY = rand() * 100;
      const points: string[] = [`M ${startX} ${startY}`];
      let x = startX;
      let y = startY;
      const segments = 4 + Math.floor(rand() * 4);

      for (let i = 0; i < segments; i++) {
        const cx1 = x + 10 + rand() * 20;
        const cy1 = y + (rand() - 0.5) * 40;
        const cx2 = cx1 + 10 + rand() * 15;
        const cy2 = cy1 + (rand() - 0.5) * 40;
        x = cx2 + 10 + rand() * 15;
        y = cy2 + (rand() - 0.5) * 30;
        points.push(`C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`);
      }

      return {
        d: points.join(' '),
        color: pickColor(),
        width: 1.5 + rand() * 3,
        opacity: 0.5 + rand() * 0.4,
      };
    });

    // Generate abstract shapes - circles, rounded rects, organic blobs
    const shapes = Array.from({ length: 5 + Math.floor(rand() * 5) }, () => {
      const shapeType = Math.floor(rand() * 5);
      const x = rand() * 100;
      const y = rand() * 100;
      const size = 8 + rand() * 25;
      const color = pickColor();
      const opacity = 0.4 + rand() * 0.5;
      const rotation = rand() * 360;

      return { shapeType, x, y, size, color, opacity, rotation };
    });

    // Generate thin lines (straight or slightly curved)
    const lines = Array.from({ length: 4 + Math.floor(rand() * 6) }, () => {
      const x1 = rand() * 100;
      const y1 = rand() * 100;
      const angle = rand() * Math.PI * 2;
      const length = 15 + rand() * 40;
      const x2 = x1 + Math.cos(angle) * length;
      const y2 = y1 + Math.sin(angle) * length;

      const curved = rand() > 0.5;
      const cx = (x1 + x2) / 2 + (rand() - 0.5) * 20;
      const cy = (y1 + y2) / 2 + (rand() - 0.5) * 20;

      return {
        d: curved ? `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}` : `M ${x1} ${y1} L ${x2} ${y2}`,
        color: pickColor(),
        width: 0.8 + rand() * 2,
        opacity: 0.4 + rand() * 0.4,
        dashed: rand() > 0.7,
      };
    });

    // Generate dots/small circles
    const dots = Array.from({ length: 10 + Math.floor(rand() * 15) }, () => ({
      cx: rand() * 100,
      cy: rand() * 100,
      r: 1 + rand() * 4,
      color: pickColor(),
      opacity: 0.4 + rand() * 0.5,
      filled: rand() > 0.3,
    }));

    // Generate arcs
    const arcs = Array.from({ length: 2 + Math.floor(rand() * 3) }, () => {
      const cx = rand() * 100;
      const cy = rand() * 100;
      const r = 10 + rand() * 30;
      const startAngle = rand() * Math.PI * 2;
      const arcLength = (0.3 + rand() * 0.7) * Math.PI;
      const endAngle = startAngle + arcLength;

      const x1 = cx + Math.cos(startAngle) * r;
      const y1 = cy + Math.sin(startAngle) * r;
      const x2 = cx + Math.cos(endAngle) * r;
      const y2 = cy + Math.sin(endAngle) * r;
      const largeArc = arcLength > Math.PI ? 1 : 0;

      return {
        d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        color: pickColor(),
        width: 1.5 + rand() * 2.5,
        opacity: 0.4 + rand() * 0.4,
      };
    });

    // Generate soft gradient blobs (background)
    const blobs = Array.from({ length: 2 + Math.floor(rand() * 2) }, () => ({
      cx: rand() * 100,
      cy: rand() * 100,
      rx: 20 + rand() * 35,
      ry: 20 + rand() * 35,
      rotation: rand() * 360,
      color: pickColor(),
      opacity: 0.25 + rand() * 0.25,
    }));

    // Generate crosses/plus signs
    const crosses = Array.from({ length: Math.floor(rand() * 4) }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: 3 + rand() * 8,
      color: pickColor(),
      opacity: 0.4 + rand() * 0.4,
      rotation: rand() * 45,
    }));

    // Generate triangles
    const triangles = Array.from({ length: Math.floor(rand() * 3) }, () => {
      const cx = rand() * 100;
      const cy = rand() * 100;
      const size = 5 + rand() * 15;
      const rotation = rand() * 360;

      return {
        cx, cy, size, rotation,
        color: pickColor(),
        opacity: 0.35 + rand() * 0.35,
        filled: rand() > 0.5,
      };
    });

    return { id, blobs, squiggles, shapes, lines, dots, arcs, crosses, triangles };
  }, [paperId]);

  // Render different shape types
  const renderShape = (shape: { shapeType: number; x: number; y: number; size: number; color: string; opacity: number; rotation: number }, i: number) => {
    const { shapeType, x, y, size, color, opacity, rotation } = shape;

    switch (shapeType) {
      case 0: // Circle
        return <circle key={i} cx={x} cy={y} r={size / 2} fill={color} opacity={opacity} />;
      case 1: // Ring
        return <circle key={i} cx={x} cy={y} r={size / 2} fill="none" stroke={color} strokeWidth={2} opacity={opacity} />;
      case 2: // Rounded rectangle
        return (
          <rect
            key={i}
            x={x - size / 2}
            y={y - size / 3}
            width={size}
            height={size * 0.66}
            rx={size * 0.15}
            fill={color}
            opacity={opacity}
            transform={`rotate(${rotation} ${x} ${y})`}
          />
        );
      case 3: // Pill/capsule
        return (
          <rect
            key={i}
            x={x - size / 2}
            y={y - size / 4}
            width={size}
            height={size / 2}
            rx={size / 4}
            fill={color}
            opacity={opacity}
            transform={`rotate(${rotation} ${x} ${y})`}
          />
        );
      case 4: // Organic blob
        const blobPath = `M ${x} ${y - size/2}
          Q ${x + size/2} ${y - size/3}, ${x + size/2} ${y}
          Q ${x + size/2} ${y + size/3}, ${x} ${y + size/2}
          Q ${x - size/2} ${y + size/3}, ${x - size/2} ${y}
          Q ${x - size/2} ${y - size/3}, ${x} ${y - size/2} Z`;
        return (
          <path
            key={i}
            d={blobPath}
            fill={color}
            opacity={opacity}
            transform={`rotate(${rotation} ${x} ${y})`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${className}`} style={{ backgroundColor: BG_COLOR }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <filter id={`${art.id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          {art.blobs.map((blob, i) => (
            <radialGradient key={i} id={`${art.id}-blob${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={blob.color} stopOpacity={blob.opacity} />
              <stop offset="100%" stopColor={blob.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Soft background blobs */}
        {art.blobs.map((blob, i) => (
          <ellipse
            key={`blob-${i}`}
            cx={blob.cx}
            cy={blob.cy}
            rx={blob.rx}
            ry={blob.ry}
            fill={`url(#${art.id}-blob${i})`}
            transform={`rotate(${blob.rotation} ${blob.cx} ${blob.cy})`}
            filter={`url(#${art.id}-soft)`}
          />
        ))}

        {/* Abstract shapes */}
        {art.shapes.map((shape, i) => renderShape(shape, i))}

        {/* Squiggly lines */}
        {art.squiggles.map((sq, i) => (
          <path
            key={`squiggle-${i}`}
            d={sq.d}
            fill="none"
            stroke={sq.color}
            strokeWidth={sq.width}
            opacity={sq.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Straight/curved lines */}
        {art.lines.map((line, i) => (
          <path
            key={`line-${i}`}
            d={line.d}
            fill="none"
            stroke={line.color}
            strokeWidth={line.width}
            opacity={line.opacity}
            strokeLinecap="round"
            strokeDasharray={line.dashed ? '3 3' : undefined}
          />
        ))}

        {/* Arcs */}
        {art.arcs.map((arc, i) => (
          <path
            key={`arc-${i}`}
            d={arc.d}
            fill="none"
            stroke={arc.color}
            strokeWidth={arc.width}
            opacity={arc.opacity}
            strokeLinecap="round"
          />
        ))}

        {/* Crosses */}
        {art.crosses.map((cross, i) => (
          <g key={`cross-${i}`} transform={`rotate(${cross.rotation} ${cross.x} ${cross.y})`}>
            <line
              x1={cross.x - cross.size}
              y1={cross.y}
              x2={cross.x + cross.size}
              y2={cross.y}
              stroke={cross.color}
              strokeWidth={2}
              opacity={cross.opacity}
              strokeLinecap="round"
            />
            <line
              x1={cross.x}
              y1={cross.y - cross.size}
              x2={cross.x}
              y2={cross.y + cross.size}
              stroke={cross.color}
              strokeWidth={2}
              opacity={cross.opacity}
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Triangles */}
        {art.triangles.map((tri, i) => {
          const { cx, cy, size, rotation, color, opacity, filled } = tri;
          const points = `${cx},${cy - size} ${cx - size * 0.866},${cy + size * 0.5} ${cx + size * 0.866},${cy + size * 0.5}`;
          return (
            <polygon
              key={`tri-${i}`}
              points={points}
              fill={filled ? color : 'none'}
              stroke={color}
              strokeWidth={filled ? 0 : 2}
              opacity={opacity}
              transform={`rotate(${rotation} ${cx} ${cy})`}
            />
          );
        })}

        {/* Dots */}
        {art.dots.map((dot, i) => (
          <circle
            key={`dot-${i}`}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={dot.filled ? dot.color : 'none'}
            stroke={dot.filled ? 'none' : dot.color}
            strokeWidth={dot.filled ? 0 : 1.5}
            opacity={dot.opacity}
          />
        ))}
      </svg>

      {/* Subtle paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export default AbstractArt;
