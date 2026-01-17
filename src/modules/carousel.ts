// Carousel модуль - проекти каруселі з infinite loop

import { querySelector, querySelectorAll, getDatasetNumber } from '../utils/dom';
import type { CarouselTrack } from '../types/dom';

/**
 * Ініціалізація каруселей проектів
 */
export function initCarousels(): void {
  const carousels = querySelectorAll<HTMLElement>('.project-card__carousel');
  
  carousels.forEach(carousel => {
    const track = querySelector<CarouselTrack>('.carousel-track', carousel);
    if (!track) return;
    
    const slides = Array.from(track.querySelectorAll<HTMLImageElement>('img'));
    if (slides.length === 0) return;
    
    // Додаємо дублікати для безшовного циклу
    const firstSlide = slides[0].cloneNode(true) as HTMLImageElement;
    const lastSlide = slides[slides.length - 1].cloneNode(true) as HTMLImageElement;
    
    track.insertBefore(lastSlide, slides[0]);
    track.appendChild(firstSlide);
    
    // Встановлюємо початкову позицію
    const slideWidth = carousel.clientWidth;
    track.dataset.index = '1';
    track.style.transition = 'none';
    track.style.transform = `translateX(-${slideWidth}px)`;
    
    setTimeout(() => {
      track.style.transition = 'transform 0.5s ease';
    }, 50);
  });

  // Click handlers для кнопок каруселі
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const prevBtn = target.closest('.carousel-btn.prev');
    const nextBtn = target.closest('.carousel-btn.next');

    if (!prevBtn && !nextBtn) return;

    const carousel = target.closest<HTMLElement>('.project-card__carousel');
    if (!carousel) return;

    const track = querySelector<CarouselTrack>('.carousel-track', carousel);
    if (!track) return;
    
    const allSlides = Array.from(track.querySelectorAll<HTMLImageElement>('img'));
    if (allSlides.length === 0) return;
    
    const originalCount = allSlides.length - 2;
    let index = getDatasetNumber(track, 'index', 1);
    const slideWidth = carousel.clientWidth;

    const handleTransitionEnd = (event: TransitionEvent): void => {
      if (event.target !== track) return;
      
      const currentIndex = getDatasetNumber(track, 'index', 1);
      
      if (currentIndex === 0) {
        track.style.transition = 'none';
        track.dataset.index = originalCount.toString();
        track.style.transform = `translateX(-${originalCount * slideWidth}px)`;
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease';
        }, 50);
      } else if (currentIndex === originalCount + 1) {
        track.style.transition = 'none';
        track.dataset.index = '1';
        track.style.transform = `translateX(-${slideWidth}px)`;
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease';
        }, 50);
      }
      
      track.removeEventListener('transitionend', handleTransitionEnd);
    };

    track.style.transition = 'transform 0.5s ease';
    track.addEventListener('transitionend', handleTransitionEnd);

    if (prevBtn) {
      index = index - 1;
      if (index < 1) {
        index = 0;
      }
    }
    
    if (nextBtn) {
      index = index + 1;
      if (index > originalCount) {
        index = originalCount + 1;
      }
    }

    track.dataset.index = index.toString();
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    carousels.forEach(carousel => {
      const track = querySelector<CarouselTrack>('.carousel-track', carousel);
      if (!track) return;
      const index = getDatasetNumber(track, 'index', 1);
      const slideWidth = carousel.clientWidth;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    });
  });

  // Touch/swipe support для мобільних
  carousels.forEach(carousel => {
    let startX = 0;
    let endX = 0;

    const track = querySelector<CarouselTrack>('.carousel-track', carousel);
    if (!track) return;

    carousel.addEventListener('touchstart', (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchmove', (e: TouchEvent) => {
      endX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', () => {
      if (!track) return;
      
      const allSlides = Array.from(track.querySelectorAll<HTMLImageElement>('img'));
      const originalCount = allSlides.length - 2;
      let index = getDatasetNumber(track, 'index', 1);
      const threshold = 50;
      const slideWidth = carousel.clientWidth;

      const handleTransitionEnd = (event: TransitionEvent): void => {
        if (event.target !== track) return;
        
        const currentIndex = getDatasetNumber(track, 'index', 1);
        
        if (currentIndex === 0) {
          track.style.transition = 'none';
          track.dataset.index = originalCount.toString();
          track.style.transform = `translateX(-${originalCount * slideWidth}px)`;
          setTimeout(() => {
            track.style.transition = 'transform 0.5s ease';
          }, 50);
        } else if (currentIndex === originalCount + 1) {
          track.style.transition = 'none';
          track.dataset.index = '1';
          track.style.transform = `translateX(-${slideWidth}px)`;
          setTimeout(() => {
            track.style.transition = 'transform 0.5s ease';
          }, 50);
        }
        
        track.removeEventListener('transitionend', handleTransitionEnd);
      };

      track.style.transition = 'transform 0.5s ease';
      track.addEventListener('transitionend', handleTransitionEnd);

      if (startX - endX > threshold) {
        index = index + 1;
        if (index > originalCount) {
          index = originalCount + 1;
        }
      } else if (endX - startX > threshold) {
        index = index - 1;
        if (index < 1) {
          index = 0;
        }
      }

      track.dataset.index = index.toString();
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      startX = 0;
      endX = 0;
    });
  });
}
