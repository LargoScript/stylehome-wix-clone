// Carousel модуль - проекти каруселі з infinite loop

import { querySelectorAll } from '../utils/dom';
import { Carousel, type CarouselOptions } from '../components/Carousel';

// Зберігаємо посилання на всі створені каруселі для можливості очищення
const carouselInstances: Carousel[] = [];

/**
 * Ініціалізація каруселей проектів
 * 
 * @param options Опції для налаштування каруселей (опціонально)
 */
export function initCarousels(options?: CarouselOptions): void {
  const carouselElements = querySelectorAll<HTMLElement>('.project-card__carousel');
  
  carouselElements.forEach(carouselElement => {
    try {
      const carousel = new Carousel(carouselElement, options);
      carouselInstances.push(carousel);
    } catch (error) {
      // Якщо карусель не може бути ініціалізована (немає слайдів, треку тощо),
      // просто пропускаємо її
      console.warn('Failed to initialize carousel:', error);
    }
  });
}

/**
 * Очищення всіх каруселей (видалення слухачів подій)
 * Корисно при динамічному оновленні сторінки
 */
export function destroyCarousels(): void {
  carouselInstances.forEach(carousel => {
    carousel.destroy();
  });
  carouselInstances.length = 0;
}

/**
 * Отримати всі екземпляри каруселей
 * Корисно для програмного керування каруселями
 */
export function getCarouselInstances(): readonly Carousel[] {
  return carouselInstances;
}
