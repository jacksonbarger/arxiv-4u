import { TopicCategory } from '@/types/arxiv';

// Gradient backgrounds for different categories
export const CATEGORY_GRADIENTS: Record<TopicCategory, string> = {
  'Computer Vision': 'from-purple-500 via-pink-500 to-red-500',
  'Natural Language Processing': 'from-blue-500 via-cyan-500 to-teal-500',
  'Machine Learning': 'from-indigo-500 via-purple-500 to-pink-500',
  'Robotics': 'from-orange-500 via-red-500 to-pink-500',
  'Reinforcement Learning': 'from-green-500 via-emerald-500 to-teal-500',
  'Generative AI': 'from-violet-500 via-fuchsia-500 to-pink-500',
  'Multimodal Learning': 'from-cyan-500 via-blue-500 to-indigo-500',
  'Speech Recognition': 'from-amber-500 via-orange-500 to-red-500',
  'AI Ethics & Safety': 'from-slate-500 via-gray-500 to-zinc-500',
  'Theoretical ML': 'from-sky-500 via-blue-500 to-indigo-500',
};

// Unsplash image IDs for different categories (curated high-quality images)
// Expanded to 15-20 images per category for maximum variety
export const CATEGORY_IMAGES: Record<TopicCategory, string[]> = {
  'Computer Vision': [
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80', // Abstract eyes
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', // Camera lens
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', // Data viz
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Tech patterns
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', // Vision tech
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80', // Digital eye
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&q=80', // Surveillance
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Visual data
    'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=800&q=80', // Face recognition
    'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80', // Camera tech
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', // Tech blue
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // Matrix
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&q=80', // Digital screen
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80', // AR/VR
    'https://images.unsplash.com/photo-1593376893114-1aed528d80cf?w=800&q=80', // Vision system
  ],
  'Natural Language Processing': [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80', // Books
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', // Typography
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80', // Writing
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', // Library
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80', // Notes
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', // Laptop writing
    'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&q=80', // Dictionary
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', // Vintage typewriter
    'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&q=80', // Text patterns
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80', // Book pages
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80', // Open book
    'https://images.unsplash.com/photo-1506784242126-2a0b0b89c56a?w=800&q=80', // Letters
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80', // Bookshelf
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', // Reading
    'https://images.unsplash.com/photo-1513001900722-370f803f498d?w=800&q=80', // Language
  ],
  'Machine Learning': [
    'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80', // AI abstract
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80', // Neural net
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', // Tech abstract
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', // Binary
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', // AI brain
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80', // Code
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&q=80', // Server
    'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80', // Circuits
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80', // Data flow
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Analytics
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80', // Network
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Visualization
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Graphs
    'https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=800&q=80', // GPU
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80', // Tech blue
    'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=800&q=80', // AI chip
  ],
  'Robotics': [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80', // Robot hand
    'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80', // Robotics
    'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&q=80', // Tech
    'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&q=80', // Robot face
    'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800&q=80', // Humanoid
    'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80', // Arm
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80', // Automation
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', // Drone
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', // Industrial
    'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80', // Manufacturing
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Engineering
    'https://images.unsplash.com/photo-1581092786450-7f6c0c912183?w=800&q=80', // Assembly
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', // Mechanical
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80', // Factory
    'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=800&q=80', // Precision
  ],
  'Reinforcement Learning': [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80', // Gaming
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', // Strategy
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80', // Abstract
    'https://images.unsplash.com/photo-1606161290889-77950cfb67d3?w=800&q=80', // Chess
    'https://images.unsplash.com/photo-1587588354456-ae376af71a25?w=800&q=80', // Control
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80', // Game controller
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80', // Joystick
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', // Gaming setup
    'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&q=80', // Competition
    'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&q=80', // Learning
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', // Simulation
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Feedback loops
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Metrics
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80', // VR training
    'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80', // Decision making
  ],
  'Generative AI': [
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80', // Abstract art
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80', // Digital art
    'https://images.unsplash.com/photo-1617791160588-241658c0f566?w=800&q=80', // Creative
    'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80', // Paint
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', // Colors
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', // Artistic
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', // Creativity
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80', // Design
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80', // Generation
    'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=800&q=80', // Neural
    'https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?w=800&q=80', // Digital creation
    'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&q=80', // Modern art
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80', // Abstract colors
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80', // Fractal
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', // Colorful AI
  ],
  'Multimodal Learning': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Mixed media
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Charts
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Data
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Multiple views
    'https://images.unsplash.com/photo-1533093818119-ac1fa47a1ca7?w=800&q=80', // Connections
    'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80', // Integration
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80', // Mixed reality
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Multi-sensor
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80', // Fusion
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80', // Combined data
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', // Cross-modal
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', // Hybrid
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', // Synthesis
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', // Multiple inputs
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80', // Diverse data
  ],
  'Speech Recognition': [
    'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80', // Microphone
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80', // Sound waves
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80', // Audio
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80', // Recording
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80', // Voice
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80', // Speaker
    'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80', // Broadcast
    'https://images.unsplash.com/photo-1576525865260-0d27b9d2d1d9?w=800&q=80', // Podcast
    'https://images.unsplash.com/photo-1590602846989-e99596d2a6ee?w=800&q=80', // Audio tech
    'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80', // Sound system
    'https://images.unsplash.com/photo-1614940177026-e820f80dc81e?w=800&q=80', // Waveform
    'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80', // Studio mic
    'https://images.unsplash.com/photo-1619987155154-f8c3c5a8a8e2?w=800&q=80', // Voice assistant
    'https://images.unsplash.com/photo-1545257820-1f3adab80f0d?w=800&q=80', // Smart speaker
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80', // Music production
  ],
  'AI Ethics & Safety': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', // Global
    'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=800&q=80', // Balance
    'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80', // Human
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80', // Trust
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80', // Security
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', // Privacy
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // Protection
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80', // Human AI
    'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800&q=80', // Governance
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', // Team ethics
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80', // Responsibility
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80', // Collaboration
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80', // Decision
    'https://images.unsplash.com/photo-1573496546735-a8fcf55d2d5e?w=800&q=80', // Fairness
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80', // Transparency
  ],
  'Theoretical ML': [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80', // Mathematics
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80', // Abstract math
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80', // Patterns
    'https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=800&q=80', // Equations
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Theory
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Algorithms
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80', // Complexity
    'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=800&q=80', // Math formulas
    'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80', // Geometric
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80', // Network graph
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80', // Statistics
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Probability
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Optimization
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80', // Convergence
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Proofs
  ],
};

// Hero background patterns
export const HERO_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', // Tech grid
  'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80', // AI abstract
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80', // Digital
];

/**
 * Get a paper thumbnail image based on its categories
 * Uses an improved hash function for better distribution and variety
 */
export function getPaperImage(paperId: string, categories?: string[], title?: string): string {
  // Improved hash function that combines paper ID with title (if available)
  // This ensures better distribution and more variety
  let hashInput = paperId;
  if (title) {
    // Include first 50 chars of title for variety, but keep deterministic
    hashInput += title.substring(0, 50);
  }

  // Better hash algorithm using FNV-1a-like approach
  let hash = 2166136261;
  for (let i = 0; i < hashInput.length; i++) {
    hash ^= hashInput.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  hash = hash >>> 0; // Convert to unsigned 32-bit integer

  if (categories && categories.length > 0) {
    const category = categories[0] as TopicCategory;
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Machine Learning'];
    return images[hash % images.length];
  }

  // Default to ML images
  const defaultImages = CATEGORY_IMAGES['Machine Learning'];
  return defaultImages[hash % defaultImages.length];
}

/**
 * Get gradient class for a category
 */
export function getCategoryGradient(category: TopicCategory): string {
  return CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS['Machine Learning'];
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
