// Main entry file (using .js extension to avoid Windows MIME type issue)
// Windows associates .ts with video/vnd.dlna.mpeg-tts

import './style.css';

// Import modules (without .ts extension - Vite resolves automatically)
import { initHeaderScroll, initServicesDarkening } from './modules/header';
import {
  initAutoBurgerMenu,
  initSmoothScroll,
  initActiveNavLink,
  initMobileMenu
} from './modules/navigation';
import { initAnimations } from './modules/animations';
import { initCarousels } from './modules/carousel';
import { initTestimonials } from './modules/testimonials';
import { initFAQ } from './modules/faq';
import { initForm } from './modules/form';
import { initBackgroundEffects } from './modules/background-effects';
import { initHero } from './modules/hero';
import { initFooter } from './modules/footer';

console.log('Style Homes website loaded');

// Hide page loader when content is ready
function hidePageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('hidden');
    // Remove from DOM after transition
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
}

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  // CRITICAL: Ensure header and all its children are visible immediately
  // This prevents any CSS/JS issues from hiding content
  const header = document.querySelector('.header');
  if (header) {
    header.style.opacity = '1';
    header.style.visibility = 'visible';
    header.style.display = 'block';
  }
  
  // Ensure all header children are visible
  const headerElements = document.querySelectorAll('.header__logo, .header__nav, .header__actions, .header__burger');
  headerElements.forEach(el => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
  });
  
  // Additional safety: force visibility after a short delay
  setTimeout(() => {
    if (header) {
      header.style.opacity = '1';
      header.style.visibility = 'visible';
    }
    headerElements.forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }, 100);
  
  // Initialize header scroll effect
  initHeaderScroll();
  
  // Initialize services darkening effect
  initServicesDarkening();
  
  // Initialize auto burger menu (must be before initSmoothScroll)
  initAutoBurgerMenu();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize smooth scroll navigation (after initAutoBurgerMenu)
  setTimeout(() => {
    initSmoothScroll();
  }, 0);
  
  // Initialize active nav link on scroll
  initActiveNavLink();
  
  // Initialize animations (wait for AOS and anime.js to be loaded)
  const waitForScripts = () => {
    // Check if scripts are loaded, with timeout
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkScripts = () => {
      attempts++;
      const aosLoaded = typeof window.AOS !== 'undefined';
      const animeLoaded = typeof window.anime !== 'undefined';
      
      if (aosLoaded && animeLoaded) {
        // Both scripts loaded, initialize animations
        initAnimations();
      } else if (attempts < maxAttempts) {
        // Scripts not loaded yet, wait a bit more
        setTimeout(checkScripts, 100);
      } else {
        // Timeout reached, initialize anyway (fallback will handle it)
        console.warn('AOS or anime.js not loaded after timeout, initializing with fallback');
        initAnimations();
      }
    };
    
    checkScripts();
  };
  
  waitForScripts();
  
  // Initialize carousels
  initCarousels();
  
  // Initialize testimonials
  initTestimonials();
  
  // Initialize FAQ
  initFAQ();
  
  // Initialize form
  initForm();
  
  // Initialize background effects
  initBackgroundEffects();
  
  // Initialize hero section (can update existing if needed)
  // initHero(); // Uncomment if you need to dynamically update Hero
  
  // Initialize footer section
  initFooter();
  
  // Hide page loader after a small delay to ensure CSS is loaded
  setTimeout(() => {
    hidePageLoader();
  }, 300);
});
