// Form модуль - auto-resize textarea

import { querySelector } from '../utils/dom';

/**
 * Ініціалізація автоматичного змінення розміру textarea
 */
export function initForm(): void {
  const textarea = querySelector<HTMLTextAreaElement>('.form__textarea');
  if (!textarea) return;
  
  // Встановлюємо початкову висоту
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
  
  // Автоматично змінюємо висоту при введенні тексту
  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    const newHeight = Math.min(this.scrollHeight, 400); // Максимальна висота 400px
    this.style.height = `${newHeight}px`;
  });
  
  // Також при завантаженні сторінки
  window.addEventListener('load', () => {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = `${newHeight}px`;
  });
}
