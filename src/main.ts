// Main TypeScript entry file
import './style.css';

// Import modules
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

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
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
  
  // Initialize animations
  initAnimations();
  
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
});
