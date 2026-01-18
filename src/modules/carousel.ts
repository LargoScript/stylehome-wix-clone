// Carousel module - проекти carousel with infinite loop

import { querySelectorAll } from '../utils/dom';
import { Carousel, type CarouselOptions } from '../components/Carousel';

// Store reference on all created carousel for можливості cleanup
const carouselInstances: Carousel[] = [];

/**
 * Initialize каруселей projects
 * 
 * @param options Опції for settings каруселей (опціонально)
 */
export function initCarousels(options?: CarouselOptions): void {
  const carouselElements = querySelectorAll<HTMLElement>('.project-card__carousel');
  
  carouselElements.forEach(carouselElement => {
    try {
      const carousel = new Carousel(carouselElement, options);
      carouselInstances.push(carousel);
    } catch (error) {
      // If карусель not може бути ініціаліwithована (doesn't exist slideів, track тоthat),
      // just skip it
      console.warn('Failed to initialize carousel:', error);
    }
  });
}

/**
 * Cleanup allх каруселей (removal listeners events)
 * Useful при dynamicallyму update page
 */
export function destroyCarousels(): void {
  carouselInstances.forEach(carousel => {
    carousel.destroy();
  });
  carouselInstances.length = 0;
}

/**
 * Get all instances каруселей
 * Useful for програмного control carousels
 */
export function getCarouselInstances(): readonly Carousel[] {
  return carouselInstances;
}
