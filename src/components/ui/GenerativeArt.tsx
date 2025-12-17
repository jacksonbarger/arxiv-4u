'use client';

import { useMemo } from 'react';
import { TopicCategory } from '@/types/arxiv';
import { CATEGORY_GRADIENT_COLORS } from '@/lib/keywords';

interface GenerativeArtProps {
  title: string;
  category: TopicCategory;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

/**
 * Seeded random number generator for deterministic output
 */
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Hash a string to a number for seeding
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Lighten a hex color
 */
function lightenColor(color: string, amount: number): string {
  const hex = (c: string) => parseInt(c, 16);
  const r = hex(color.slice(1, 3));
  const g = hex(color.slice(3, 5));
  const b = hex(color.slice(5, 7));

  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// All 35 pattern types
type PatternType =
  | 'chevron' | 'herringbone' | 'honeycomb' | 'triangles' | 'squares'
  | 'diamonds' | 'polkaDots' | 'stripes' | 'concentricCircles' | 'sunburst'
  | 'quatrefoil' | 'ogee' | 'scallop' | 'crosses' | 'stars'
  | 'moroccan' | 'greekKey' | 'houndstooth' | 'plaid' | 'basketweave'
  | 'zigzag' | 'waves' | 'spiral' | 'isometric' | 'triangleGrid'
  | 'overlappingCircles' | 'lattice' | 'artDecoFan' | 'confetti' | 'mosaic'
  | 'pinwheel' | 'fishScale' | 'brick' | 'arabesque' | 'hexDots';

const PATTERN_TYPES: PatternType[] = [
  'chevron', 'herringbone', 'honeycomb', 'triangles', 'squares',
  'diamonds', 'polkaDots', 'stripes', 'concentricCircles', 'sunburst',
  'quatrefoil', 'ogee', 'scallop', 'crosses', 'stars',
  'moroccan', 'greekKey', 'houndstooth', 'plaid', 'basketweave',
  'zigzag', 'waves', 'spiral', 'isometric', 'triangleGrid',
  'overlappingCircles', 'lattice', 'artDecoFan', 'confetti', 'mosaic',
  'pinwheel', 'fishScale', 'brick', 'arabesque', 'hexDots'
];

/**
 * GenerativeArt - Creates unique procedural artwork based on paper title
 * using 35 different geometric pattern types
 */
export function GenerativeArt({
  title,
  category,
  className = '',
  variant = 'default',
}: GenerativeArtProps) {
  const colors = CATEGORY_GRADIENT_COLORS[category] || CATEGORY_GRADIENT_COLORS['other'];

  const artwork = useMemo(() => {
    const seed = hashString(title);
    const random = seededRandom(seed);

    // Select pattern based on title hash
    const patternIndex = seed % PATTERN_TYPES.length;
    const pattern = PATTERN_TYPES[patternIndex];

    // Generate color palette from category colors
    const palette = [
      colors.start,
      colors.end,
      lightenColor(colors.start, 0.3),
      lightenColor(colors.end, 0.4),
      lightenColor(colors.start, 0.6),
    ];

    return { pattern, random, palette, seed };
  }, [title, colors]);

  const { pattern, random, palette, seed } = artwork;

  const width = 400;
  const height = variant === 'featured' ? 300 : variant === 'compact' ? 150 : 200;
  const bgColor = lightenColor(colors.start, 0.9);
  const gradientId = `bg-${seed}`;

  const renderPattern = () => {
    switch (pattern) {
      case 'chevron': return renderChevron();
      case 'herringbone': return renderHerringbone();
      case 'honeycomb': return renderHoneycomb();
      case 'triangles': return renderTriangles();
      case 'squares': return renderSquares();
      case 'diamonds': return renderDiamonds();
      case 'polkaDots': return renderPolkaDots();
      case 'stripes': return renderStripes();
      case 'concentricCircles': return renderConcentricCircles();
      case 'sunburst': return renderSunburst();
      case 'quatrefoil': return renderQuatrefoil();
      case 'ogee': return renderOgee();
      case 'scallop': return renderScallop();
      case 'crosses': return renderCrosses();
      case 'stars': return renderStars();
      case 'moroccan': return renderMoroccan();
      case 'greekKey': return renderGreekKey();
      case 'houndstooth': return renderHoundstooth();
      case 'plaid': return renderPlaid();
      case 'basketweave': return renderBasketweave();
      case 'zigzag': return renderZigzag();
      case 'waves': return renderWaves();
      case 'spiral': return renderSpiral();
      case 'isometric': return renderIsometric();
      case 'triangleGrid': return renderTriangleGrid();
      case 'overlappingCircles': return renderOverlappingCircles();
      case 'lattice': return renderLattice();
      case 'artDecoFan': return renderArtDecoFan();
      case 'confetti': return renderConfetti();
      case 'mosaic': return renderMosaic();
      case 'pinwheel': return renderPinwheel();
      case 'fishScale': return renderFishScale();
      case 'brick': return renderBrick();
      case 'arabesque': return renderArabesque();
      case 'hexDots': return renderHexDots();
      default: return renderChevron();
    }
  };

  // Pattern 1: Chevron
  const renderChevron = () => {
    const elements = [];
    const rowHeight = 30;
    const amplitude = 15;
    for (let y = 0; y < height + rowHeight; y += rowHeight) {
      let d = `M 0 ${y + amplitude}`;
      for (let x = 0; x <= width; x += 20) {
        const peak = (x / 20) % 2 === 0;
        d += ` L ${x} ${y + (peak ? 0 : amplitude * 2)}`;
      }
      elements.push(
        <path key={y} d={d} stroke={palette[y % 2 === 0 ? 0 : 1]} strokeWidth={3} fill="none" opacity={0.6} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 2: Herringbone
  const renderHerringbone = () => {
    const elements = [];
    const size = 20;
    for (let y = -size; y < height + size; y += size) {
      for (let x = -size; x < width + size; x += size * 2) {
        const offset = ((y / size) % 2) * size;
        elements.push(
          <rect key={`${x}-${y}`} x={x + offset} y={y} width={size * 0.8} height={size * 0.3}
            fill={palette[(x + y) % 3 === 0 ? 0 : 1]} opacity={0.5}
            transform={`rotate(45 ${x + offset + size/2} ${y + size/2})`} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 3: Honeycomb
  const renderHoneycomb = () => {
    const elements = [];
    const size = 25;
    const h = size * Math.sqrt(3);
    for (let row = 0; row < height / h + 1; row++) {
      for (let col = 0; col < width / (size * 1.5) + 1; col++) {
        const x = col * size * 1.5;
        const y = row * h + (col % 2 === 0 ? 0 : h / 2);
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i + Math.PI / 6;
          points.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
        }
        elements.push(
          <polygon key={`${row}-${col}`} points={points.join(' ')}
            fill="none" stroke={palette[0]} strokeWidth={2} opacity={0.5} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 4: Triangles
  const renderTriangles = () => {
    const elements = [];
    const size = 30;
    for (let y = 0; y < height + size; y += size * 0.866) {
      for (let x = 0; x < width + size; x += size) {
        const offset = (Math.floor(y / (size * 0.866)) % 2) * (size / 2);
        const flip = (Math.floor(x / size) + Math.floor(y / (size * 0.866))) % 2 === 0;
        const cx = x + offset;
        const cy = y;
        const points = flip
          ? `${cx},${cy} ${cx + size},${cy} ${cx + size/2},${cy + size * 0.866}`
          : `${cx + size/2},${cy} ${cx},${cy + size * 0.866} ${cx + size},${cy + size * 0.866}`;
        elements.push(
          <polygon key={`${x}-${y}`} points={points}
            fill={palette[(Math.floor(x / size) + Math.floor(y / (size * 0.866))) % 3]}
            opacity={0.4 + random() * 0.3} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 5: Squares
  const renderSquares = () => {
    const elements = [];
    const size = 35;
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        const innerSize = size * (0.4 + random() * 0.4);
        elements.push(
          <rect key={`${x}-${y}`} x={x + (size - innerSize) / 2} y={y + (size - innerSize) / 2}
            width={innerSize} height={innerSize}
            fill={palette[Math.floor(random() * palette.length)]} opacity={0.5}
            rx={random() > 0.5 ? 4 : 0} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 6: Diamonds
  const renderDiamonds = () => {
    const elements = [];
    const size = 30;
    for (let y = -size; y < height + size; y += size) {
      for (let x = -size; x < width + size; x += size) {
        const offset = ((y / size) % 2) * (size / 2);
        const cx = x + offset + size / 2;
        const cy = y + size / 2;
        elements.push(
          <polygon key={`${x}-${y}`}
            points={`${cx},${cy - size/2} ${cx + size/2},${cy} ${cx},${cy + size/2} ${cx - size/2},${cy}`}
            fill={palette[(Math.floor(x / size) + Math.floor(y / size)) % 2]}
            opacity={0.5} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 7: Polka Dots
  const renderPolkaDots = () => {
    const elements = [];
    const spacing = 30;
    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) {
        const offset = ((y / spacing) % 2) * (spacing / 2);
        const r = 5 + random() * 8;
        elements.push(
          <circle key={`${x}-${y}`} cx={x + offset} cy={y} r={r}
            fill={palette[Math.floor(random() * 2)]} opacity={0.6} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 8: Stripes
  const renderStripes = () => {
    const elements = [];
    const angle = random() > 0.5 ? 45 : -45;
    const spacing = 15 + random() * 10;
    for (let i = -width; i < width + height; i += spacing) {
      elements.push(
        <line key={i} x1={i} y1={0} x2={i + height} y2={height}
          stroke={palette[Math.floor(i / spacing) % 2]} strokeWidth={spacing * 0.4} opacity={0.4}
          transform={`rotate(${angle} ${width/2} ${height/2})`} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 9: Concentric Circles
  const renderConcentricCircles = () => {
    const elements = [];
    const cx = width * (0.3 + random() * 0.4);
    const cy = height * (0.3 + random() * 0.4);
    const maxR = Math.max(width, height);
    for (let r = 20; r < maxR; r += 20) {
      elements.push(
        <circle key={r} cx={cx} cy={cy} r={r}
          fill="none" stroke={palette[Math.floor(r / 20) % 2]} strokeWidth={3} opacity={0.4} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 10: Sunburst
  const renderSunburst = () => {
    const elements = [];
    const cx = width / 2;
    const cy = height / 2;
    const rays = 24 + Math.floor(random() * 12);
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 / rays) * i;
      const length = Math.max(width, height);
      elements.push(
        <line key={i} x1={cx} y1={cy}
          x2={cx + Math.cos(angle) * length} y2={cy + Math.sin(angle) * length}
          stroke={palette[i % 2]} strokeWidth={2 + random() * 3} opacity={0.4} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 11: Quatrefoil
  const renderQuatrefoil = () => {
    const elements = [];
    const size = 40;
    for (let y = 0; y < height + size; y += size) {
      for (let x = 0; x < width + size; x += size) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        const r = size / 4;
        const offset = size / 3;
        elements.push(
          <g key={`${x}-${y}`} opacity={0.5}>
            <circle cx={cx} cy={cy - offset} r={r} fill={palette[0]} />
            <circle cx={cx + offset} cy={cy} r={r} fill={palette[0]} />
            <circle cx={cx} cy={cy + offset} r={r} fill={palette[0]} />
            <circle cx={cx - offset} cy={cy} r={r} fill={palette[0]} />
          </g>
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 12: Ogee
  const renderOgee = () => {
    const elements = [];
    const size = 50;
    for (let y = -size; y < height + size; y += size) {
      for (let x = -size; x < width + size; x += size) {
        const offset = ((y / size) % 2) * (size / 2);
        elements.push(
          <path key={`${x}-${y}`}
            d={`M ${x + offset} ${y + size/2} Q ${x + offset + size/2} ${y} ${x + offset + size} ${y + size/2} Q ${x + offset + size/2} ${y + size} ${x + offset} ${y + size/2}`}
            fill={palette[(Math.floor(x / size) + Math.floor(y / size)) % 2]} opacity={0.4} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 13: Scallop
  const renderScallop = () => {
    const elements = [];
    const size = 30;
    for (let y = 0; y < height + size; y += size * 0.7) {
      for (let x = -size; x < width + size; x += size) {
        const offset = (Math.floor(y / (size * 0.7)) % 2) * (size / 2);
        elements.push(
          <path key={`${x}-${y}`}
            d={`M ${x + offset} ${y + size/2} A ${size/2} ${size/2} 0 0 1 ${x + offset + size} ${y + size/2}`}
            fill={palette[(Math.floor(x / size) + Math.floor(y / (size * 0.7))) % 2]} opacity={0.5} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 14: Crosses
  const renderCrosses = () => {
    const elements = [];
    const size = 35;
    const thickness = size / 4;
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        elements.push(
          <g key={`${x}-${y}`} opacity={0.5}>
            <rect x={cx - thickness/2} y={cy - size/3} width={thickness} height={size * 2/3} fill={palette[0]} />
            <rect x={cx - size/3} y={cy - thickness/2} width={size * 2/3} height={thickness} fill={palette[0]} />
          </g>
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 15: Stars
  const renderStars = () => {
    const elements = [];
    const size = 40;
    for (let y = size/2; y < height; y += size) {
      for (let x = size/2; x < width; x += size) {
        const points = [];
        const innerR = size / 6;
        const outerR = size / 3;
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (Math.PI * 2 / 10) * i - Math.PI / 2;
          points.push(`${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`);
        }
        elements.push(
          <polygon key={`${x}-${y}`} points={points.join(' ')}
            fill={palette[Math.floor(random() * 2)]} opacity={0.5} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 16: Moroccan
  const renderMoroccan = () => {
    const elements = [];
    const size = 35;
    for (let y = 0; y < height + size; y += size) {
      for (let x = 0; x < width + size; x += size) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        elements.push(
          <g key={`${x}-${y}`}>
            <circle cx={cx} cy={cy} r={size/3} fill="none" stroke={palette[0]} strokeWidth={2} opacity={0.5} />
            <circle cx={cx} cy={cy} r={size/6} fill={palette[1]} opacity={0.3} />
          </g>
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 17: Greek Key
  const renderGreekKey = () => {
    const elements = [];
    const size = 20;
    for (let y = 0; y < height; y += size * 2) {
      let d = `M 0 ${y}`;
      for (let x = 0; x < width; x += size * 4) {
        d += ` l ${size} 0 l 0 ${size} l ${-size/2} 0 l 0 ${-size/2} l ${size * 1.5} 0 l 0 ${size} l ${size} 0`;
      }
      elements.push(
        <path key={y} d={d} fill="none" stroke={palette[0]} strokeWidth={3} opacity={0.5} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 18: Houndstooth
  const renderHoundstooth = () => {
    const elements = [];
    const size = 25;
    for (let y = 0; y < height + size; y += size) {
      for (let x = 0; x < width + size; x += size) {
        const flip = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
        if (flip) {
          elements.push(
            <path key={`${x}-${y}`}
              d={`M ${x} ${y} l ${size/2} ${size/2} l ${size/2} ${-size/2} l ${-size/4} 0 l ${-size/4} ${size/4} l ${-size/4} ${-size/4} z`}
              fill={palette[0]} opacity={0.5} />
          );
        }
      }
    }
    return <>{elements}</>;
  };

  // Pattern 19: Plaid
  const renderPlaid = () => {
    const elements = [];
    const spacing = 30;
    // Horizontal lines
    for (let y = 0; y < height; y += spacing) {
      elements.push(
        <rect key={`h-${y}`} x={0} y={y} width={width} height={spacing * 0.3}
          fill={palette[0]} opacity={0.3} />
      );
    }
    // Vertical lines
    for (let x = 0; x < width; x += spacing) {
      elements.push(
        <rect key={`v-${x}`} x={x} y={0} width={spacing * 0.3} height={height}
          fill={palette[1]} opacity={0.3} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 20: Basketweave
  const renderBasketweave = () => {
    const elements = [];
    const size = 30;
    for (let y = 0; y < height + size; y += size) {
      for (let x = 0; x < width + size; x += size) {
        const horizontal = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
        elements.push(
          <rect key={`${x}-${y}`}
            x={x + 2} y={y + 2} width={size - 4} height={size / 3 - 2}
            fill={palette[0]} opacity={0.5}
            transform={horizontal ? '' : `rotate(90 ${x + size/2} ${y + size/2})`} />,
          <rect key={`${x}-${y}-2`}
            x={x + 2} y={y + size/3 + 2} width={size - 4} height={size / 3 - 2}
            fill={palette[1]} opacity={0.5}
            transform={horizontal ? '' : `rotate(90 ${x + size/2} ${y + size/2})`} />,
          <rect key={`${x}-${y}-3`}
            x={x + 2} y={y + size * 2/3 + 2} width={size - 4} height={size / 3 - 2}
            fill={palette[0]} opacity={0.5}
            transform={horizontal ? '' : `rotate(90 ${x + size/2} ${y + size/2})`} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 21: Zigzag
  const renderZigzag = () => {
    const elements = [];
    const amplitude = 20;
    const wavelength = 30;
    for (let y = 0; y < height + amplitude; y += amplitude * 1.5) {
      let d = `M 0 ${y}`;
      for (let x = 0; x <= width; x += wavelength / 2) {
        d += ` L ${x} ${y + ((x / (wavelength / 2)) % 2 === 0 ? 0 : amplitude)}`;
      }
      elements.push(
        <path key={y} d={d} stroke={palette[Math.floor(y / (amplitude * 1.5)) % 2]}
          strokeWidth={4} fill="none" opacity={0.5} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 22: Waves
  const renderWaves = () => {
    const elements = [];
    const amplitude = 15;
    const wavelength = 50;
    for (let y = 20; y < height; y += 25) {
      let d = `M 0 ${y}`;
      for (let x = 0; x <= width; x += 5) {
        d += ` L ${x} ${y + Math.sin((x / wavelength) * Math.PI * 2) * amplitude}`;
      }
      elements.push(
        <path key={y} d={d} stroke={palette[Math.floor(y / 25) % 2]}
          strokeWidth={3} fill="none" opacity={0.5} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 23: Spiral
  const renderSpiral = () => {
    const elements = [];
    const cx = width / 2;
    const cy = height / 2;
    let d = `M ${cx} ${cy}`;
    const turns = 5;
    const points = 200;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2 * turns;
      const r = (i / points) * Math.min(width, height) / 2;
      d += ` L ${cx + Math.cos(angle) * r} ${cy + Math.sin(angle) * r}`;
    }
    elements.push(
      <path d={d} stroke={palette[0]} strokeWidth={3} fill="none" opacity={0.5} />
    );
    return <>{elements}</>;
  };

  // Pattern 24: Isometric Cubes
  const renderIsometric = () => {
    const elements = [];
    const size = 30;
    for (let y = 0; y < height + size * 2; y += size * 1.5) {
      for (let x = 0; x < width + size * 2; x += size * 1.73) {
        const offset = (Math.floor(y / (size * 1.5)) % 2) * (size * 0.866);
        const cx = x + offset;
        const cy = y;
        // Top face
        elements.push(
          <polygon key={`${x}-${y}-t`}
            points={`${cx},${cy} ${cx + size * 0.5},${cy - size * 0.3} ${cx + size},${cy} ${cx + size * 0.5},${cy + size * 0.3}`}
            fill={palette[0]} opacity={0.5} />
        );
        // Left face
        elements.push(
          <polygon key={`${x}-${y}-l`}
            points={`${cx},${cy} ${cx + size * 0.5},${cy + size * 0.3} ${cx + size * 0.5},${cy + size * 0.8} ${cx},${cy + size * 0.5}`}
            fill={palette[1]} opacity={0.4} />
        );
        // Right face
        elements.push(
          <polygon key={`${x}-${y}-r`}
            points={`${cx + size},${cy} ${cx + size * 0.5},${cy + size * 0.3} ${cx + size * 0.5},${cy + size * 0.8} ${cx + size},${cy + size * 0.5}`}
            fill={lightenColor(palette[0], 0.2)} opacity={0.4} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 25: Triangle Grid
  const renderTriangleGrid = () => {
    const elements = [];
    const size = 25;
    for (let y = 0; y < height; y += size * 0.866) {
      for (let x = 0; x < width; x += size / 2) {
        const up = (Math.floor(x / (size / 2)) + Math.floor(y / (size * 0.866))) % 2 === 0;
        const offset = (Math.floor(y / (size * 0.866)) % 2) * (size / 4);
        const points = up
          ? `${x + offset},${y + size * 0.866} ${x + offset + size / 2},${y} ${x + offset + size},${y + size * 0.866}`
          : `${x + offset},${y} ${x + offset + size / 2},${y + size * 0.866} ${x + offset + size},${y}`;
        elements.push(
          <polygon key={`${x}-${y}`} points={points}
            fill="none" stroke={palette[0]} strokeWidth={1} opacity={0.4} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 26: Overlapping Circles (Flower of Life style)
  const renderOverlappingCircles = () => {
    const elements = [];
    const r = 25;
    for (let y = 0; y < height + r * 2; y += r * 1.5) {
      for (let x = 0; x < width + r * 2; x += r * 1.73) {
        const offset = (Math.floor(y / (r * 1.5)) % 2) * (r * 0.866);
        elements.push(
          <circle key={`${x}-${y}`} cx={x + offset} cy={y} r={r}
            fill="none" stroke={palette[(Math.floor(x / r) + Math.floor(y / r)) % 2]}
            strokeWidth={2} opacity={0.4} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 27: Lattice
  const renderLattice = () => {
    const elements = [];
    const spacing = 25;
    // Diagonal lines one way
    for (let i = -height; i < width + height; i += spacing) {
      elements.push(
        <line key={`d1-${i}`} x1={i} y1={0} x2={i + height} y2={height}
          stroke={palette[0]} strokeWidth={2} opacity={0.4} />
      );
    }
    // Diagonal lines other way
    for (let i = -height; i < width + height; i += spacing) {
      elements.push(
        <line key={`d2-${i}`} x1={i} y1={height} x2={i + height} y2={0}
          stroke={palette[1]} strokeWidth={2} opacity={0.4} />
      );
    }
    return <>{elements}</>;
  };

  // Pattern 28: Art Deco Fan
  const renderArtDecoFan = () => {
    const elements = [];
    const size = 50;
    for (let y = 0; y < height + size; y += size) {
      for (let x = 0; x < width + size; x += size) {
        const offset = (Math.floor(y / size) % 2) * (size / 2);
        const cx = x + offset;
        const cy = y + size;
        for (let r = size * 0.2; r <= size; r += size * 0.2) {
          elements.push(
            <path key={`${x}-${y}-${r}`}
              d={`M ${cx} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy - r * 0.7}`}
              fill="none" stroke={palette[Math.floor(r / (size * 0.2)) % 2]}
              strokeWidth={2} opacity={0.4} />
          );
        }
      }
    }
    return <>{elements}</>;
  };

  // Pattern 29: Confetti
  const renderConfetti = () => {
    const elements = [];
    const count = variant === 'compact' ? 30 : 60;
    for (let i = 0; i < count; i++) {
      const x = random() * width;
      const y = random() * height;
      const size = 5 + random() * 15;
      const rotation = random() * 360;
      const shape = Math.floor(random() * 3);
      if (shape === 0) {
        elements.push(
          <rect key={i} x={x} y={y} width={size} height={size * 0.4}
            fill={palette[Math.floor(random() * palette.length)]} opacity={0.6}
            transform={`rotate(${rotation} ${x + size/2} ${y + size * 0.2})`} />
        );
      } else if (shape === 1) {
        elements.push(
          <circle key={i} cx={x} cy={y} r={size / 3}
            fill={palette[Math.floor(random() * palette.length)]} opacity={0.6} />
        );
      } else {
        elements.push(
          <polygon key={i} points={`${x},${y - size/3} ${x + size/3},${y + size/3} ${x - size/3},${y + size/3}`}
            fill={palette[Math.floor(random() * palette.length)]} opacity={0.6}
            transform={`rotate(${rotation} ${x} ${y})`} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 30: Mosaic
  const renderMosaic = () => {
    const elements = [];
    const baseSize = 30;
    for (let y = 0; y < height; y += baseSize) {
      for (let x = 0; x < width; x += baseSize) {
        const subdivide = random() > 0.6;
        if (subdivide) {
          const half = baseSize / 2;
          elements.push(
            <rect key={`${x}-${y}-1`} x={x} y={y} width={half - 1} height={half - 1}
              fill={palette[Math.floor(random() * palette.length)]} opacity={0.5} />,
            <rect key={`${x}-${y}-2`} x={x + half} y={y} width={half - 1} height={half - 1}
              fill={palette[Math.floor(random() * palette.length)]} opacity={0.5} />,
            <rect key={`${x}-${y}-3`} x={x} y={y + half} width={half - 1} height={half - 1}
              fill={palette[Math.floor(random() * palette.length)]} opacity={0.5} />,
            <rect key={`${x}-${y}-4`} x={x + half} y={y + half} width={half - 1} height={half - 1}
              fill={palette[Math.floor(random() * palette.length)]} opacity={0.5} />
          );
        } else {
          elements.push(
            <rect key={`${x}-${y}`} x={x} y={y} width={baseSize - 2} height={baseSize - 2}
              fill={palette[Math.floor(random() * palette.length)]} opacity={0.5} />
          );
        }
      }
    }
    return <>{elements}</>;
  };

  // Pattern 31: Pinwheel
  const renderPinwheel = () => {
    const elements = [];
    const size = 50;
    for (let y = size / 2; y < height; y += size) {
      for (let x = size / 2; x < width; x += size) {
        const blades = 4;
        for (let i = 0; i < blades; i++) {
          const angle = (Math.PI * 2 / blades) * i;
          const nextAngle = (Math.PI * 2 / blades) * (i + 0.5);
          elements.push(
            <path key={`${x}-${y}-${i}`}
              d={`M ${x} ${y} L ${x + Math.cos(angle) * size / 2} ${y + Math.sin(angle) * size / 2} L ${x + Math.cos(nextAngle) * size / 3} ${y + Math.sin(nextAngle) * size / 3} Z`}
              fill={palette[i % 2]} opacity={0.5} />
          );
        }
      }
    }
    return <>{elements}</>;
  };

  // Pattern 32: Fish Scale
  const renderFishScale = () => {
    const elements = [];
    const size = 30;
    for (let y = 0; y < height + size; y += size * 0.6) {
      for (let x = -size; x < width + size; x += size) {
        const offset = (Math.floor(y / (size * 0.6)) % 2) * (size / 2);
        elements.push(
          <circle key={`${x}-${y}`} cx={x + offset + size / 2} cy={y} r={size / 2}
            fill={palette[(Math.floor(x / size) + Math.floor(y / (size * 0.6))) % 2]} opacity={0.4} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 33: Brick
  const renderBrick = () => {
    const elements = [];
    const brickW = 50;
    const brickH = 25;
    for (let y = 0; y < height; y += brickH) {
      for (let x = -brickW; x < width + brickW; x += brickW) {
        const offset = (Math.floor(y / brickH) % 2) * (brickW / 2);
        elements.push(
          <rect key={`${x}-${y}`} x={x + offset + 2} y={y + 2}
            width={brickW - 4} height={brickH - 4} rx={2}
            fill={palette[(Math.floor(x / brickW) + Math.floor(y / brickH)) % 2]} opacity={0.5} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 34: Arabesque
  const renderArabesque = () => {
    const elements = [];
    const size = 40;
    for (let y = 0; y < height + size; y += size) {
      for (let x = 0; x < width + size; x += size) {
        const cx = x + size / 2;
        const cy = y + size / 2;
        elements.push(
          <path key={`${x}-${y}`}
            d={`M ${cx - size/3} ${cy} Q ${cx} ${cy - size/3} ${cx + size/3} ${cy} Q ${cx} ${cy + size/3} ${cx - size/3} ${cy}`}
            fill="none" stroke={palette[0]} strokeWidth={2} opacity={0.5} />
        );
        elements.push(
          <path key={`${x}-${y}-2`}
            d={`M ${cx} ${cy - size/3} Q ${cx + size/3} ${cy} ${cx} ${cy + size/3} Q ${cx - size/3} ${cy} ${cx} ${cy - size/3}`}
            fill="none" stroke={palette[1]} strokeWidth={2} opacity={0.5} />
        );
      }
    }
    return <>{elements}</>;
  };

  // Pattern 35: Hex Dots
  const renderHexDots = () => {
    const elements = [];
    const size = 25;
    const h = size * Math.sqrt(3) / 2;
    for (let row = 0; row < height / h + 1; row++) {
      for (let col = 0; col < width / size + 1; col++) {
        const x = col * size * 1.5;
        const y = row * h * 2 + (col % 2 === 0 ? 0 : h);
        const dotR = 3 + random() * 4;
        elements.push(
          <circle key={`${row}-${col}`} cx={x} cy={y} r={dotR}
            fill={palette[Math.floor(random() * 2)]} opacity={0.6} />
        );
      }
    }
    return <>{elements}</>;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lightenColor(colors.start, 0.85)} />
            <stop offset="100%" stopColor={lightenColor(colors.end, 0.8)} />
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#${gradientId})`} />
        {renderPattern()}
      </svg>
    </div>
  );
}

export default GenerativeArt;
