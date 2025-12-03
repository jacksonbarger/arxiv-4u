import { TopicCategory } from '@/types/arxiv';

// Gradient backgrounds for different categories
export const CATEGORY_GRADIENTS: Record<TopicCategory, string> = {
  'agentic-coding': 'from-indigo-500 via-purple-500 to-pink-500',
  'image-generation': 'from-violet-500 via-fuchsia-500 to-pink-500',
  'video-generation': 'from-cyan-500 via-blue-500 to-indigo-500',
  'ai-content-creators': 'from-orange-500 via-red-500 to-pink-500',
  'comfyui': 'from-green-500 via-emerald-500 to-teal-500',
  'runpod': 'from-blue-500 via-cyan-500 to-teal-500',
  'market-opportunity': 'from-amber-500 via-orange-500 to-red-500',
  'other': 'from-slate-500 via-gray-500 to-zinc-500',
};

// Unsplash image IDs for different categories
export const CATEGORY_IMAGES: Record<TopicCategory, string[]> = {
  'agentic-coding': [
    'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    'https://images.unsplash.com/photo-504639725590-34d0984388bd?w=800&q=80',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&q=80',
  ],
  'image-generation': [
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80',
    'https://images.unsplash.com/photo-1617791160588-241658c0f566?w=800&q=80',
    'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  ],
  'video-generation': [
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
  ],
  'ai-content-creators': [
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
  ],
  'comfyui': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'https://images.unsplash.com/photo-1533093818119-ac1fa47a1ca7?w=800&q=80',
    'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80',
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
  ],
  'runpod': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&q=80',
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=800&q=80',
  ],
  'market-opportunity': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
  ],
  'other': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=800&q=80',
    'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
  ],
};

// Hero background patterns
export const HERO_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
  'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
];

/**
 * Get a paper thumbnail image based on its categories
 */
export function getPaperImage(paperId: string, categories?: string[], title?: string): string {
  let hashInput = paperId;
  if (title) {
    hashInput += title.substring(0, 50);
  }

  let hash = 2166136261;
  for (let i = 0; i < hashInput.length; i++) {
    hash ^= hashInput.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  hash = hash >>> 0;

  if (categories && categories.length > 0) {
    const category = categories[0] as TopicCategory;
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['other'];
    return images[hash % images.length];
  }

  const defaultImages = CATEGORY_IMAGES['other'];
  return defaultImages[hash % defaultImages.length];
}

/**
 * Get gradient class for a category
 */
export function getCategoryGradient(category: TopicCategory): string {
  return CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS['other'];
}

/**
 * Generate abstract SVG pattern for papers without images
 */
export function generateAbstractPattern(paperId: string): string {
  const hash = paperId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  const saturation = 60 + (hash % 40);
  const lightness = 50 + (hash % 30);

  return `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:hsl(${hue}, ${saturation}%, ${lightness}%);stop-opacity:1" />
          <stop offset="100%" style="stop-color:hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness - 10}%);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#grad${hash})"/>
      <circle cx="${200 + (hash % 400)}" cy="${150 + (hash % 300)}" r="${80 + (hash % 120)}" fill="rgba(255,255,255,0.1)"/>
      <circle cx="${400 + (hash % 200)}" cy="${300 + (hash % 200)}" r="${60 + (hash % 100)}" fill="rgba(255,255,255,0.15)"/>
      <circle cx="${100 + (hash % 300)}" cy="${400 + (hash % 150)}" r="${90 + (hash % 110)}" fill="rgba(255,255,255,0.1)"/>
    </svg>
  `;
}

/**
 * Get author avatar placeholder
 */
export function getAuthorAvatar(authorName: string): string {
  const hash = authorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarId = hash % 100;
  return `https://i.pravatar.cc/150?img=${avatarId}`;
}
