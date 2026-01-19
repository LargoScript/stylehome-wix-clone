// Animations module - AOS та Anime.js animation

import { querySelector, querySelectorAll } from '../utils/dom';
import type { AnimeConfig } from '../types/anime';
import type { AOSOptions } from '../types/aos';

/**
 * Initialize allх анімацій
 */
export function initAnimations(): void {
  // Initialize AOS (Animate On Scroll)
  if (typeof window.AOS !== 'undefined') {
    const aosOptions: AOSOptions = {
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom',
      disable: 'mobile'
    };
    window.AOS.init(aosOptions);
  }

  // Animation Header elements on load
  const headerLogo = querySelector<HTMLElement>('.header__logo');
  const headerNav = querySelector<HTMLElement>('.header__nav');
  const headerActions = querySelector<HTMLElement>('.header__actions');

  // CRITICAL: Always ensure elements are visible first
  // This prevents elements from being hidden if animations fail
  if (headerLogo) {
    headerLogo.style.opacity = '1';
    headerLogo.style.visibility = 'visible';
  }
  if (headerNav) {
    headerNav.style.opacity = '1';
    headerNav.style.visibility = 'visible';
  }
  if (headerActions) {
    headerActions.style.opacity = '1';
    headerActions.style.visibility = 'visible';
  }

  // Fallback: ensure elements are visible if anime.js is not loaded
  if (typeof window.anime === 'undefined') {
    // Already visible from above, just ensure transforms are reset
    if (headerLogo) {
      headerLogo.style.transform = 'none';
    }
    if (headerNav) {
      headerNav.style.transform = 'none';
    }
    if (headerActions) {
      headerActions.style.transform = 'none';
    }
    return; // Exit early if anime.js is not available
  }

  // Safety timeout: if animations don't complete in 2 seconds, make elements visible
  let safetyTimeout: ReturnType<typeof setTimeout> | null = null;
  
  if (typeof window.anime !== 'undefined') {
    safetyTimeout = setTimeout(() => {
      if (headerLogo) {
        headerLogo.style.opacity = '1';
        headerLogo.style.visibility = 'visible';
        headerLogo.style.transform = 'none';
      }
      if (headerNav) {
        headerNav.style.opacity = '1';
        headerNav.style.visibility = 'visible';
        headerNav.style.transform = 'none';
      }
      if (headerActions) {
        headerActions.style.opacity = '1';
        headerActions.style.visibility = 'visible';
        headerActions.style.transform = 'none';
      }
      console.warn('Animation safety timeout: forcing elements visible');
    }, 2000);

    // First hide elements (only if anime.js is confirmed available)
    if (headerLogo) {
      headerLogo.style.opacity = '0';
      headerLogo.style.transform = 'translateX(-30px)';
    }
    if (headerNav) {
      headerNav.style.opacity = '0';
      headerNav.style.transform = 'translateY(-20px)';
    }
    if (headerActions) {
      headerActions.style.opacity = '0';
      headerActions.style.transform = 'translateX(30px)';
    }

    // Animation logo (from left)
    if (headerLogo && safetyTimeout) {
      const logoConfig: AnimeConfig = {
        targets: headerLogo,
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 800,
        delay: 100,
        easing: 'easeOutCubic',
        complete: () => {
          // Clear safety timeout on successful animation
          if (safetyTimeout) {
            clearTimeout(safetyTimeout);
            safetyTimeout = null;
          }
          if (headerLogo) {
            headerLogo.style.visibility = 'visible';
          }
        }
      };
      window.anime(logoConfig);
    }

    // Animation navigation (from top)
    if (headerNav) {
      const navConfig: AnimeConfig = {
        targets: headerNav,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutCubic'
      };
      window.anime(navConfig);

      // Animation nav links one by one
      const navLinks = querySelectorAll<HTMLElement>('.header__nav-link', headerNav);
      navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        const linkConfig: AnimeConfig = {
          targets: link,
          opacity: [0, 1],
          translateY: [-10, 0],
          duration: 400,
          delay: 300 + (index * 50),
          easing: 'easeOutCubic'
        };
        window.anime(linkConfig);
      });
    }

    // Animation actions (from right)
    if (headerActions) {
      const actionsConfig: AnimeConfig = {
        targets: headerActions,
        opacity: [0, 1],
        translateX: [30, 0],
        duration: 800,
        delay: 400,
        easing: 'easeOutCubic',
        complete: () => {
          // Ensure visibility after animation
          if (headerActions) {
            headerActions.style.visibility = 'visible';
          }
        }
      };
      window.anime(actionsConfig);
    }

    // Animation Hero section
    const badgeConfig: AnimeConfig = {
      targets: '.hero__badge',
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 1000,
      delay: 600,
      easing: 'easeOutCubic'
    };
    window.anime(badgeConfig);

    const heroCardConfig: AnimeConfig = {
      targets: '.hero__card',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1200,
      delay: 900,
      easing: 'easeOutCubic'
    };
    window.anime(heroCardConfig);

    const heroTitleConfig: AnimeConfig = {
      targets: '.hero__title',
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1000,
      delay: 1100,
      easing: 'easeOutElastic(1, .6)'
    };
    window.anime(heroTitleConfig);

    // Animation project cards on hover
    const projectCards = querySelectorAll<HTMLElement>('.project-card');
    projectCards.forEach((card) => {
      const carousel = querySelector<HTMLElement>('.project-card__carousel', card);
      if (carousel) {
        card.addEventListener('mouseenter', () => {
          const hoverConfig: AnimeConfig = {
            targets: carousel,
            scale: 1.05,
            duration: 400,
            easing: 'easeOutQuad'
          };
          window.anime(hoverConfig);
        });

        card.addEventListener('mouseleave', () => {
          const leaveConfig: AnimeConfig = {
            targets: carousel,
            scale: 1,
            duration: 400,
            easing: 'easeOutQuad'
          };
          window.anime(leaveConfig);
        });
      }
    });

    // Animation кнопок форми on hover
    const formButtons = querySelectorAll<HTMLElement>('.form__submit');
    formButtons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        const enterConfig: AnimeConfig = {
          targets: btn,
          scale: 1.05,
          duration: 200,
          easing: 'easeOutQuad'
        };
        window.anime(enterConfig);
      });

      btn.addEventListener('mouseleave', () => {
        const leaveConfig: AnimeConfig = {
          targets: btn,
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        };
        window.anime(leaveConfig);
      });
    });

    // Animation services-hero cards on hover
    const servicesHeroCards = querySelectorAll<HTMLElement>('.services-hero__card');
    servicesHeroCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const enterConfig: AnimeConfig = {
          targets: card,
          scale: 1.03,
          duration: 300,
          easing: 'easeOutQuad'
        };
        window.anime(enterConfig);
      });

      card.addEventListener('mouseleave', () => {
        const leaveConfig: AnimeConfig = {
          targets: card,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuad'
        };
        window.anime(leaveConfig);
      });
    });
  }
}
