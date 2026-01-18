// Animations модуль - AOS та Anime.js анімації

import { querySelector, querySelectorAll } from '../utils/dom';
import type { AnimeConfig } from '../types/anime';
import type { AOSOptions } from '../types/aos';

/**
 * Ініціалізація всіх анімацій
 */
export function initAnimations(): void {
  // Ініціалізуємо AOS (Animate On Scroll)
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

  // Анімація Header елементів при завантаженні
  if (typeof window.anime !== 'undefined') {
    const headerLogo = querySelector<HTMLElement>('.header__logo');
    const headerNav = querySelector<HTMLElement>('.header__nav');
    const headerActions = querySelector<HTMLElement>('.header__actions');

    // Спочатку ховаємо елементи
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

    // Анімація logo (зліва)
    if (headerLogo) {
      const logoConfig: AnimeConfig = {
        targets: headerLogo,
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 800,
        delay: 100,
        easing: 'easeOutCubic'
      };
      window.anime(logoConfig);
    }

    // Анімація navigation (зверху)
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

      // Анімація nav links по черзі
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

    // Анімація actions (справа)
    if (headerActions) {
      const actionsConfig: AnimeConfig = {
        targets: headerActions,
        opacity: [0, 1],
        translateX: [30, 0],
        duration: 800,
        delay: 400,
        easing: 'easeOutCubic'
      };
      window.anime(actionsConfig);
    }

    // Анімація Hero секції
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

    // Анімація project cards при hover
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

    // Анімація кнопок форми при hover
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

    // Анімація services-hero cards при hover
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
