/**
 * Calculate estimated reading time for an arXiv paper
 * Academic papers are read slower than blog posts (150-200 WPM vs 200-250 WPM)
 */

export interface ReadingTimeEstimate {
  minutes: number;
  displayText: string;
  category: 'quick' | 'medium' | 'long';
}

export function estimateReadingTime(abstract: string): ReadingTimeEstimate {
  // Count words in abstract
  const words = abstract.trim().split(/\s+/).length;

  // Academic reading speed: ~175 words per minute
  const WPM = 175;

  // Calculate minutes for abstract
  const abstractMinutes = words / WPM;

  // Add estimated time for full paper based on typical arXiv paper length
  // Most papers are 8-12 pages, ~500 words/page, so ~4000-6000 words
  // We'll estimate an average of 5000 words for the full paper
  const estimatedFullPaperWords = 5000;
  const fullPaperMinutes = estimatedFullPaperWords / WPM;

  // Total reading time (abstract + full paper)
  const totalMinutes = Math.ceil(abstractMinutes + fullPaperMinutes);

  // Categorize reading time
  let category: 'quick' | 'medium' | 'long';
  if (totalMinutes <= 15) {
    category = 'quick';
  } else if (totalMinutes <= 35) {
    category = 'medium';
  } else {
    category = 'long';
  }

  // Create display text
  let displayText: string;
  if (totalMinutes < 5) {
    displayText = 'Quick read';
  } else if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    displayText = mins > 0 ? `${hours}h ${mins}m read` : `${hours}h read`;
  } else {
    displayText = `${totalMinutes} min read`;
  }

  return {
    minutes: totalMinutes,
    displayText,
    category,
  };
}

/**
 * Get color for reading time badge based on category
 */
export function getReadingTimeBadgeColor(category: 'quick' | 'medium' | 'long'): {
  bg: string;
  text: string;
} {
  switch (category) {
    case 'quick':
      return { bg: '#DCFCE7', text: '#166534' }; // Green
    case 'medium':
      return { bg: '#FEF3C7', text: '#92400E' }; // Amber
    case 'long':
      return { bg: '#FEE2E2', text: '#991B1B' }; // Red
  }
}
