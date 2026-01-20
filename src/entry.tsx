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
  const header = document.querySelector<HTMLElement>('.header');
  if (header) {
    header.style.opacity = '1';
    header.style.visibility = 'visible';
    header.style.display = 'block';
  }
  
  // Ensure all header children are visible
  const headerElements = document.querySelectorAll<HTMLElement>('.header__logo, .header__nav, .header__actions, .header__burger');
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
  
  // Safe initialization wrapper
  function safeInit(name: string, fn: () => void): void {
    try {
      fn();
    } catch (error) {
      console.error(`Error initializing ${name}:`, error);
    }
  }

  // Initialize header scroll effect
  safeInit('headerScroll', initHeaderScroll);
  
  // Initialize services darkening effect
  safeInit('servicesDarkening', initServicesDarkening);
  
  // Initialize auto burger menu (must be before initSmoothScroll)
  safeInit('autoBurgerMenu', initAutoBurgerMenu);
  
  // Initialize mobile menu
  safeInit('mobileMenu', initMobileMenu);
  
  // Initialize smooth scroll navigation (after initAutoBurgerMenu)
  setTimeout(() => {
    safeInit('smoothScroll', initSmoothScroll);
  }, 0);
  
  // Initialize active nav link on scroll
  safeInit('activeNavLink', initActiveNavLink);
  
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
        safeInit('animations', initAnimations);
      } else if (attempts < maxAttempts) {
        // Scripts not loaded yet, wait a bit more
        setTimeout(checkScripts, 100);
      } else {
        // Timeout reached, initialize anyway (fallback will handle it)
        console.warn('AOS or anime.js not loaded after timeout, initializing with fallback');
        safeInit('animations', initAnimations);
      }
    };
    
    checkScripts();
  };
  
  waitForScripts();
  
  // Initialize carousels
  safeInit('carousels', initCarousels);
  
  // Initialize testimonials
  safeInit('testimonials', initTestimonials);
  
  // Initialize FAQ
  safeInit('faq', initFAQ);
  
  // Initialize form
  safeInit('form', initForm);
  
  // Initialize background effects
  safeInit('backgroundEffects', initBackgroundEffects);
  
  // Initialize hero section (can update existing if needed)
  // initHero(); // Uncomment if you need to dynamically update Hero
  
  // Initialize footer section
  safeInit('footer', initFooter);
  
  // Hide page loader after a small delay to ensure CSS is loaded
  setTimeout(() => {
    hidePageLoader();
  }, 300);
});
