// FAQ module - accordion

import { querySelector, querySelectorAll } from '../utils/dom';

/**
 * Initialize FAQ accordion
 */
export function initFAQ(): void {
  const faqItems = querySelectorAll<HTMLElement>('.faq__item');
  
  faqItems.forEach(item => {
    const question = querySelector<HTMLElement>('.faq__question', item);
    const answer = querySelector<HTMLElement>('.faq__answer', item);
    
    if (!question || !answer) return;
    
    // Protection from double binding
    if (question.dataset.bound) return;
    question.dataset.bound = 'true';
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all інші elements
      faqItems.forEach(i => {
        if (i !== item) {
          const a = querySelector<HTMLElement>('.faq__answer', i);
          i.classList.remove('active');
          if (a) {
            a.style.maxHeight = '0';
          }
        }
      });
      
      // Toggle current елемент
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
  
  // Update height on change size window
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
