// FAQ модуль - accordion

import { querySelector, querySelectorAll } from '../utils/dom';

/**
 * Ініціалізація FAQ accordion
 */
export function initFAQ(): void {
  const faqItems = querySelectorAll<HTMLElement>('.faq__item');
  
  faqItems.forEach(item => {
    const question = querySelector<HTMLElement>('.faq__question', item);
    const answer = querySelector<HTMLElement>('.faq__answer', item);
    
    if (!question || !answer) return;
    
    // Захист від подвійного навішування
    if (question.dataset.bound) return;
    question.dataset.bound = 'true';
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Закриваємо всі інші елементи
      faqItems.forEach(i => {
        if (i !== item) {
          const a = querySelector<HTMLElement>('.faq__answer', i);
          i.classList.remove('active');
          if (a) {
            a.style.maxHeight = '0';
          }
        }
      });
      
      // Перемикаємо поточний елемент
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = '0';
        requestAnimationFrame(() => {
          const height = answer.scrollHeight + 30;
          answer.style.maxHeight = `${height}px`;
        });
      } else {
        const currentHeight = answer.scrollHeight + 30;
        answer.style.maxHeight = `${currentHeight}px`;
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
          item.classList.remove('active');
        });
      }
    });
  });
  
  // Оновлюємо висоту при зміні розміру вікна
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('active')) {
        const answer = querySelector<HTMLElement>('.faq__answer', item);
        if (answer && answer.style.maxHeight && answer.style.maxHeight !== '0px') {
          const height = answer.scrollHeight + 30;
          answer.style.maxHeight = `${height}px`;
        }
      }
    });
  });
}
