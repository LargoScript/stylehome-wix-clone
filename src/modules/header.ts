// Header модуль - scroll effect та затемнення services

import { querySelector } from '../utils/dom';
import type { ServicesSection } from '../types/dom';

/**
 * Ініціалізація ефекту скролу для header
 */
export function initHeaderScroll(): void {
  const header = querySelector<HTMLElement>('.header');
  if (!header) return;

  const handleScroll = (): void => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial state
}

/**
 * Ініціалізація затемнення services секції при скролі
 */
export function initServicesDarkening(): void {
  const servicesSection = querySelector<ServicesSection>('.services');
  if (!servicesSection) return;

  let ticking = false;

  const handleScroll = (): void => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = servicesSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        // Розраховуємо прогрес затемнення
        let scrollProgress = 0;
        
        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
          // Секція видима на екрані
          scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)));
        } else if (sectionTop <= -sectionHeight * 0.5) {
          // Секція повністю прокручена вгору
          scrollProgress = 1;
        }
        
        // Динамічно змінюємо прозорість затемнення (від 0 до 0.4)
        const opacity = scrollProgress * 0.4;
        servicesSection.style.setProperty('--darken-opacity', opacity.toString());
        
        // Додаємо клас для плавного переходу
        if (opacity > 0.1) {
          servicesSection.classList.add('scrolled');
        } else {
          servicesSection.classList.remove('scrolled');
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial state
}
