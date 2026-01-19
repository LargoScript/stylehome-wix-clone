// Carousel module - projects carousel with infinite loop

import { querySelectorAll } from '../utils/dom';
import { Carousel, type CarouselOptions } from '../components/Carousel';

// Store reference to all created carousels for cleanup capability
const carouselInstances: Carousel[] = [];

/**
 * Initialize project carousels
 * 
 * @param options Options for carousel settings (optional)
 */
export function initCarousels(options?: CarouselOptions): void {
  const carouselElements = querySelectorAll<HTMLElement>('.project-card__carousel');
  
  carouselElements.forEach(carouselElement => {
    try {
      const carousel = new Carousel(carouselElement, options);
      carouselInstances.push(carousel);
    } catch (error) {
      // If carousel cannot be initialized (slides, track don't exist, etc.),
      // just skip it
      console.warn('Failed to initialize carousel:', error);
    }
  });
}

/**
 * Cleanup all carousels (remove event listeners)
 * Useful for dynamic page updates
 */
export function destroyCarousels(): void {
  carouselInstances.forEach(carousel => {
    carousel.destroy();
  });
  carouselInstances.length = 0;
}

/**
 * Get all carousel instances
 * Useful for programmatic carousel control
 */
export function getCarouselInstances(): readonly Carousel[] {
  return carouselInstances;
}
