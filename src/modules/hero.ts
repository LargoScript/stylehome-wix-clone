// Module for initializing Hero sections

import { insertHero, type HeroConfig } from '../components/Hero';

/**
 * Hero configurations for different pages
 */
const heroConfigs: Record<string, HeroConfig> = {
  index: {
    mediaType: 'video',
    mediaSrc: '/video/hero.mp4',
    title: 'KITCHEN & BATH REMODELING',
    subtitle: 'Smart Investment • Quality Craftsmanship',
    location: 'Portland OR & Vancouver WA',
    badgeText: 'You imagine it,<br><strong>STYLE HOMES</strong> creates it!',
    isSubpage: false,
    sectionId: 'hero'
  },
  kitchen: {
    mediaType: 'image',
    mediaSrc: '/img/kitchen-renovation.jpg',
    title: 'KITCHEN RENOVATION',
    subtitle: 'Smart Investment • Quality Craftsmanship',
    location: 'Portland OR & Vancouver WA',
    badgeText: 'You imagine it,<br><strong>STYLE HOMES</strong> creates it!',
    isSubpage: true,
    sectionId: 'hero'
  },
  bathroom: {
    mediaType: 'image',
    mediaSrc: '/img/bathroom-renovation.jpg',
    title: 'BATHROOM RENOVATION',
    subtitle: 'Smart Investment • Quality Craftsmanship',
    location: 'Portland OR & Vancouver WA',
    badgeText: 'You imagine it,<br><strong>STYLE HOMES</strong> creates it!',
    isSubpage: true,
    sectionId: 'hero'
  }
};

/**
 * Determine current page by URL
 */
function getCurrentPage(): string {
  const path = window.location.pathname;
  if (path.includes('kitchen-renovation')) return 'kitchen';
  if (path.includes('bathroom-renovation')) return 'bathroom';
  return 'index';
}

/**
 * Initialize Hero section on current page
 */
export function initHero(): void {
  const page = getCurrentPage();
  const config = heroConfigs[page];
  
  if (!config) {
    console.warn(`Hero config not found for page: ${page}`);
    return;
  }

  // Check if hero section already exists
  const existingHero = document.querySelector<HTMLElement>('.hero');
  
  if (existingHero) {
    // If exists, update it
    const main = document.querySelector<HTMLElement>('main');
    if (main && existingHero.parentElement === main) {
      // Replace existing hero
      insertHero(main, config);
    }
  } else {
    // If doesn't exist, insert new one
    const main = document.querySelector<HTMLElement>('main');
    if (main) {
      insertHero(main, config);
    }
  }
}

/**
 * Initialize Hero with custom configuration
 */
export function initHeroWithConfig(config: HeroConfig): void {
  const main = document.querySelector<HTMLElement>('main');
  if (main) {
    insertHero(main, config);
  }
}
