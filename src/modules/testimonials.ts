// Testimonials модуль - карусель відгуків

import { querySelector, querySelectorAll } from '../utils/dom';

/**
 * Ініціалізація каруселі відгуків
 */
export function initTestimonials(): void {
  const testimonialsTrack = querySelector<HTMLElement>('.testimonials__track');
  const testimonialsCards = querySelectorAll<HTMLElement>('.testimonial-card');
  const testimonialsPrevBtn = querySelector<HTMLElement>('.testimonials__btn--prev');
  const testimonialsNextBtn = querySelector<HTMLElement>('.testimonials__btn--next');
  const testimonialsDots = querySelectorAll<HTMLElement>('.testimonials__dot');
  const carouselWrapper = querySelector<HTMLElement>('.testimonials__carousel-wrapper');
  
  if (!testimonialsTrack || testimonialsCards.length === 0) return;
  
  let currentTestimonialIndex = 0;
  
  const updateTestimonialsCarousel = (): void => {
    testimonialsTrack.style.transform = `translateX(-${currentTestimonialIndex * 100}%)`;
    
    if (carouselWrapper) {
      carouselWrapper.scrollTop = 0;
    }
    
    testimonialsDots.forEach((dot, index) => {
      if (index === currentTestimonialIndex) {
        dot.classList.add('testimonials__dot--active');
      } else {
        dot.classList.remove('testimonials__dot--active');
      }
    });
  };
  
  if (testimonialsNextBtn) {
    testimonialsNextBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialsCards.length;
      updateTestimonialsCarousel();
    });
  }
  
  if (testimonialsPrevBtn) {
    testimonialsPrevBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialsCards.length) % testimonialsCards.length;
      updateTestimonialsCarousel();
    });
  }
  
  testimonialsDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentTestimonialIndex = index;
      updateTestimonialsCarousel();
    });
  });
}
