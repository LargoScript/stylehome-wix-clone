// Testimonials module - testimonials carousel with Google Reviews

import { querySelector, querySelectorAll } from '../utils/dom';
import { testimonials, googleReviewsSummary, Testimonial } from '../data/testimonials';

/**
 * Render star rating
 */
function renderStars(rating: number): string {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars += '<span class="testimonial-card__star testimonial-card__star--filled">★</span>';
    } else {
      stars += '<span class="testimonial-card__star">★</span>';
    }
  }
  return stars;
}

/**
 * Get initials from name
 */
function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Get avatar color based on name
 */
function getAvatarColor(name: string): string {
  const colors = [
    '#10b981', // teal-green
    '#000000', // black
    '#8b5cf6', // purple
    '#3b82f6', // blue
    '#ef4444', // red
    '#f59e0b', // orange
    '#06b6d4', // cyan
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Render Google Reviews summary box
 */
function renderGoogleReviewsSummary(): string {
  return `
    <div class="testimonials__google-summary">
      <div class="testimonials__google-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span class="testimonials__google-text">Google Reviews</span>
      </div>
      <div class="testimonials__google-rating">
        <span class="testimonials__google-rating-value">${googleReviewsSummary.rating.toFixed(1)}</span>
        <div class="testimonials__google-stars">
          ${renderStars(Math.floor(googleReviewsSummary.rating))}
        </div>
        <span class="testimonials__google-count">(${googleReviewsSummary.totalReviews})</span>
      </div>
      ${googleReviewsSummary.reviewUrl ? `
        <a href="${googleReviewsSummary.reviewUrl}" target="_blank" rel="noopener noreferrer" class="testimonials__google-button">
          Review us on Google
        </a>
      ` : ''}
    </div>
  `;
}

/**
 * Render testimonial card
 */
function renderTestimonialCard(testimonial: Testimonial): string {
  const initials = testimonial.authorInitials || getInitials(testimonial.authorName);
  const avatarColor = getAvatarColor(testimonial.authorName);

  return `
    <div class="testimonial-card" data-testimonial-id="${testimonial.id}">
      <div class="testimonial-card__avatar" style="background-color: ${avatarColor}">
        <span class="testimonial-card__avatar-initials">${initials}</span>
        <div class="testimonial-card__google-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        </div>
      </div>
      <div class="testimonial-card__header">
        <div class="testimonial-card__name">${testimonial.authorName}</div>
        ${testimonial.verified ? '<span class="testimonial-card__verified">✓</span>' : ''}
      </div>
      <div class="testimonial-card__date">${testimonial.dateRelative}</div>
      <div class="testimonial-card__rating">
        ${renderStars(testimonial.rating)}
      </div>
      <p class="testimonial-card__text">${testimonial.text}</p>
      ${testimonial.fullText && testimonial.fullText.length > testimonial.text.length ? `
        <a href="#" class="testimonial-card__read-more" data-testimonial-id="${testimonial.id}">Read more</a>
      ` : ''}
    </div>
  `;
}

/**
 * Initialize testimonials carousel
 */
export function initTestimonials(): void {
  const testimonialsContainer = querySelector<HTMLElement>('.testimonials__container');
  if (!testimonialsContainer) return;

  const carouselWrapper = querySelector<HTMLElement>('.testimonials__carousel-wrapper');
  if (!carouselWrapper) return;

  // Render Google Reviews summary
  const header = querySelector<HTMLElement>('.testimonials__header');
  if (header) {
    const summaryHTML = renderGoogleReviewsSummary();
    header.insertAdjacentHTML('afterend', summaryHTML);
  }

  // Render testimonials
  const track = querySelector<HTMLElement>('.testimonials__track');
  if (track) {
    // Clear existing testimonials
    track.innerHTML = '';

    // Render all testimonials
    testimonials.forEach(testimonial => {
      track.insertAdjacentHTML('beforeend', renderTestimonialCard(testimonial));
    });

    // Update dots
    const dotsContainer = querySelector<HTMLElement>('.testimonials__dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      const visibleCount = Math.min(3, testimonials.length); // Show 3 at a time
      const totalPages = Math.ceil(testimonials.length / visibleCount);

      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'testimonials__dot';
        if (i === 0) {
          dot.classList.add('testimonials__dot--active');
        }
        dotsContainer.appendChild(dot);
      }
    }
  }

  // Initialize carousel functionality
  const testimonialsCards = querySelectorAll<HTMLElement>('.testimonial-card');
  const testimonialsPrevBtn = querySelector<HTMLElement>('.testimonials__btn--prev');
  const testimonialsNextBtn = querySelector<HTMLElement>('.testimonials__btn--next');
  let testimonialsDots = querySelectorAll<HTMLElement>('.testimonials__dot');

  if (testimonialsCards.length === 0) return;

  let currentTestimonialIndex = 0;

  // Dynamic cards per view based on screen width
  const getCardsPerView = (): number => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  let cardsPerView = getCardsPerView();
  let totalPages = Math.ceil(testimonialsCards.length / cardsPerView);

  const updateTestimonialsCarousel = (): void => {
    if (track) {
      // Calculate how many cards to show per view
      // Recalculate based on current cardsPerView
      const cardWidth = 100 / cardsPerView;
      const translateX = -(currentTestimonialIndex * cardWidth);
      track.style.transform = `translateX(${translateX}%)`;
    }

    // Update dots logic - simpler approach for responsive
    // Just highlight the dot corresponding to the current index / page
    testimonialsDots.forEach((dot, index) => {
      // Calculate which page this dot represents
      // This simple logic assumes 1 dot per page, but we might have more dots than pages if we resized
      // For now, reset dots if needed or just accept index mapping might be slightly off if not re-rendered
      // Ideally we should re-render dots on resize, but let's keep it simple first
      if (index === currentTestimonialIndex) {
        dot.classList.add('testimonials__dot--active');
      } else {
        dot.classList.remove('testimonials__dot--active');
      }
    });
  };

  // Handle Resize
  window.addEventListener('resize', () => {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
      cardsPerView = newCardsPerView;
      totalPages = Math.ceil(testimonialsCards.length / cardsPerView);
      // Reset to first slide to avoid index out of bounds or weird offsets
      currentTestimonialIndex = 0;
      updateTestimonialsCarousel();
      // Note: Dots are not re-rendered here, so the number of dots might be incorrect for the new page count
      // For a perfect implementation we should re-render dots, but let's see if this is sufficient
      // Actually, let's re-render dots to be correct
      const dotsContainer = querySelector<HTMLElement>('.testimonials__dots');
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
          const dot = document.createElement('div');
          dot.className = 'testimonials__dot';
          if (i === 0) dot.classList.add('testimonials__dot--active');

          // Add click listener to new dot
          dot.addEventListener('click', () => {
            currentTestimonialIndex = i;
            updateTestimonialsCarousel();
          });

          dotsContainer.appendChild(dot);
        }
        // Update the testimonialsDots NodeList after re-rendering
        testimonialsDots = querySelectorAll<HTMLElement>('.testimonials__dot');
      }
    }
  });

  if (testimonialsNextBtn) {
    testimonialsNextBtn.addEventListener('click', () => {
      if (currentTestimonialIndex < totalPages - 1) {
        currentTestimonialIndex++;
      } else {
        currentTestimonialIndex = 0; // Loop back
      }
      updateTestimonialsCarousel();
    });
  }

  if (testimonialsPrevBtn) {
    testimonialsPrevBtn.addEventListener('click', () => {
      if (currentTestimonialIndex > 0) {
        currentTestimonialIndex--;
      } else {
        currentTestimonialIndex = totalPages - 1; // Loop to end
      }
      updateTestimonialsCarousel();
    });
  }

  // Previous dots listeners (initial load)
  testimonialsDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentTestimonialIndex = index;
      updateTestimonialsCarousel();
    });
  });

  // Handle "Read more" clicks
  const readMoreLinks = querySelectorAll<HTMLElement>('.testimonial-card__read-more');
  readMoreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const testimonialId = link.getAttribute('data-testimonial-id');
      if (testimonialId) {
        const testimonial = testimonials.find(t => t.id === testimonialId);
        if (testimonial && testimonial.fullText) {
          const card = link.closest('.testimonial-card');
          const textElement = card?.querySelector<HTMLElement>('.testimonial-card__text');
          if (textElement) {
            textElement.textContent = testimonial.fullText;
            link.style.display = 'none';
          }
        }
      }
    });
  });
}
